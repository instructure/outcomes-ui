import { expect, jest } from '@jest/globals'
import debounceLatestPromise from '../debounceLatestPromise'


jest.mock('lodash/debounce', () => {
  return ((fn, ms) => {
    let timeoutId
    const debounced = (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fn(...args)
      }, ms)
    }
    return debounced
  })
})

describe('debounceLatestPromise', () => {

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('correctly debounces', () => {
    const dispatch = jest.fn().mockResolvedValue(() => 'resolved')
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    jest.advanceTimersByTime(400)
    expect(dispatch).not.toHaveBeenCalled()
    jest.advanceTimersByTime(100)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith('search #1')
  })

  it('correctly debounces the latest promise', () => {
    const dispatch = jest.fn().mockResolvedValue(() => 'resolved')
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    debounced('search #2')
    jest.advanceTimersByTime(500)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith('search #2')
  })

  it('calls the function again after the timeout passes', () => {
    const dispatch = jest.fn().mockResolvedValue(() => 'resolved')
    const debounced = debounceLatestPromise((...args) => dispatch(...args), 500)
    debounced('search #1')
    jest.advanceTimersByTime(500)
    debounced('search #2')
    jest.advanceTimersByTime(500)
    expect(dispatch).toHaveBeenCalledWith('search #1')
    expect(dispatch).toHaveBeenCalledWith('search #2')
  })
})
