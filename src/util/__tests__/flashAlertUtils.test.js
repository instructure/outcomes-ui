import { expect } from '@jest/globals'
import { findDetailMessage, isLoadingChunkError } from '../flashAlertUtils'

describe('findDetailMessage', () => {
  it('returns just the message if there is no response', () => {
    const error = {message: 'Error!'}
    expect(findDetailMessage(error)).toEqual({a: error.message, b: undefined})
  })

  it('returns both messages if errors is not an array', () => {
    const error = {message: 'Error!', response: { data: { message: 'Message!', errors: '' }}}
    expect(findDetailMessage(error)).toEqual({a: error.response.data.message, b: error.message})
  })

  it('returns the message and first error if errors is an array', () => {
    const error = {message: 'Error!', response: { data: { message: 'Message!', errors: [{message: 'First error!'}, {message: 'Second error!'}] }}}
    expect(findDetailMessage(error)).toEqual({a: error.response.data.errors[0].message, b: error.message})
  })
})

describe('isLoadingChunkError', () => {
  it('returns true if the string contains loading chunk text', () => {
    expect(isLoadingChunkError('loading chunk')).toEqual(true)
    expect(isLoadingChunkError('loading chunk error')).toEqual(true)
    expect(isLoadingChunkError('error loading chunk')).toEqual(true)
  })

  it('returns false if the string does not contain loading chunk text', () => {
    expect(isLoadingChunkError('loading')).toEqual(false)
    expect(isLoadingChunkError('chunk')).toEqual(false)
    expect(isLoadingChunkError('error loading')).toEqual(false)
    expect(isLoadingChunkError('loading error')).toEqual(false)
    expect(isLoadingChunkError('error chunk')).toEqual(false)
    expect(isLoadingChunkError('chunk error')).toEqual(false)
  })
})