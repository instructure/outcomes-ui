import { expect } from 'chai'
import sinon from 'sinon'
import { getStore, makeScope, makeUserScope } from '../index'

const host = 'http://outcomes.docker'
const jwt = 'jwt'

describe('getStore', () => {
  it('exports a function', () => {
    expect(getStore).to.be.a('function')
  })

  it('returns an object', () => {
    const store = getStore(host, jwt, 'scope')
    expect(store).to.be.an('object')
  })

  it('returns a well formed store', () => {
    const store = getStore(host, jwt, 'scope')
    expect(store).to.contain.all.keys(
      'dispatch subscribe getState replaceReducer'.split(' ')
    )
  })

  it('returns the same store for multiple scopes', () => {
    const store = getStore(host, jwt, 'scope')
    const store2 = getStore(host, jwt, 'scope2')
    expect(store2).to.equal(store)
  })

  it('creates state for each scope', () => {
    const store = getStore(host, jwt, 'scope')
    getStore(host, jwt, 'scope2')
    expect(store.getState().toJS()).to.include.keys('scope', 'scope2')
  })

  it('calls replaceReducer per unique scope', () => {
    const store = getStore(host, jwt, 'scope')
    const stub = sinon.stub(store, 'replaceReducer')
    getStore(host, jwt, 'scope')
    getStore(host, jwt, 'scopefoo')
    getStore(host, jwt, 'scopefoo')
    getStore(host, jwt, 'scopebar')
    getStore(host, jwt, 'scopebar')
    // replaceReducer already called once for 'scope' before we stub
    expect(stub).to.have.been.calledTwice
  })
})

describe('makeScope', () => {
  it('returns unique scope string for different ids', () => {
    const thing1 = makeScope('thing', 1)
    const thing2 = makeScope('thing', 2)
    expect(thing1).not.to.equal(thing2)
  })

  it('returns unique scope for different types', () => {
    const foo = makeScope('foo', 1)
    const bar = makeScope('bar', 1)
    expect(foo).not.to.equal(bar)
  })
})

describe('makeUserScope', () => {
  it('returns unique user scope string for different user uuids', () => {
    const thing1 = makeUserScope('user1')
    const thing2 = makeUserScope('user2')
    expect(thing1).not.to.equal(thing2)
  })
})
