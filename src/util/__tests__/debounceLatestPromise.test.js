import { expect } from 'chai'
import sinon from 'sinon'
import debounceLatestPromise from '../debouceLatestPromise'

describe('debounceLatestPromise', () => {
  const dispatch = sinon.stub().resolves(() => 'resolved')

  let clock = null
  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
    dispatch.resetHistory()
  })

  it ('correctly debounces', () => {
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    clock.tick(400)
    expect(dispatch).to.not.be.called
    clock.tick(100)
    expect(dispatch).to.be.called.once
    expect(dispatch).to.be.calledWith('search #1')
  })

  it('correctly debounces the latest promise', () => {
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    debounced('search #2')
    clock.tick(500)
    expect(dispatch).to.be.called.once
    expect(dispatch).to.be.calledWith('search #2')
  })

  it('calls the function again after the timeout passes', () => {
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    clock.tick(500)
    debounced('search #2')
    clock.tick(500)
    expect(dispatch).to.be.called.calledTwice
    expect(dispatch).to.be.calledWith('search #1')
    expect(dispatch).to.be.calledWith('search #2')
  })
})
