import { expect, jest, describe, it } from '@jest/globals'
import { getStore, makeScope, makeUserScope } from '../index'

const host = 'http://outcomes.docker'
const jwt = 'jwt'

describe('getStore', () => {
  it('exports a function', () => {
    expect(typeof getStore).toBe('function')
  })

  it('returns an object', () => {
    const store = getStore(host, jwt, 'scope')
    expect(typeof store).toBe('object')
  })

  it('returns a well formed store', () => {
    const store = getStore(host, jwt, 'scope')
    expect(store).toHaveProperty('dispatch')
    expect(store).toHaveProperty('subscribe')
    expect(store).toHaveProperty('getState')
    expect(store).toHaveProperty('replaceReducer')
  })

  it('returns the same store for multiple scopes', () => {
    const store = getStore(host, jwt, 'scope')
    const store2 = getStore(host, jwt, 'scope2')
    expect(store2).toBe(store)
  })

  it('creates state for each scope', () => {
    const store = getStore(host, jwt, 'scope')
    getStore(host, jwt, 'scope2')

    // Using toJS() to convert Immutable data structure to plain JS
    const storeState = store.getState().toJS()
    expect(storeState).toHaveProperty('scope')
    expect(storeState).toHaveProperty('scope2')
  })

  it('calls replaceReducer per unique scope', () => {
    const store = getStore(host, jwt, 'scope')

    // Use Jest's spyOn instead of sinon.stub
    jest.spyOn(store, 'replaceReducer')

    getStore(host, jwt, 'scope')
    getStore(host, jwt, 'scopefoo')
    getStore(host, jwt, 'scopefoo')
    getStore(host, jwt, 'scopebar')
    getStore(host, jwt, 'scopebar')

    // replaceReducer already called once for 'scope' before we spy
    expect(store.replaceReducer).toHaveBeenCalledTimes(2)
  })
})

describe('makeScope', () => {
  it('returns unique scope string for different ids', () => {
    const thing1 = makeScope('thing', 1)
    const thing2 = makeScope('thing', 2)
    expect(thing1).not.toBe(thing2)
  })

  it('returns unique scope for different types', () => {
    const foo = makeScope('foo', 1)
    const bar = makeScope('bar', 1)
    expect(foo).not.toBe(bar)
  })
})

describe('makeUserScope', () => {
  it('returns unique user scope string for different user uuids', () => {
    const thing1 = makeUserScope('user1')
    const thing2 = makeUserScope('user2')
    expect(thing1).not.toBe(thing2)
  })
})
