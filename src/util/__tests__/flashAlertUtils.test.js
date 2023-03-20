import { expect } from 'chai'
import { findDetailMessage, isLoadingChunkError } from '../flashAlertUtils'

describe('findDetailMessage', () => {
  it('returns just the message if there is no response', () => {
    const error = {message: 'Error!'}
    expect(findDetailMessage(error)).to.deep.eq({a: error.message, b: undefined})
  })

  it('returns both messages if errors is not an array', () => {
    const error = {message: 'Error!', response: { data: { message: 'Message!', errors: '' }}}
    expect(findDetailMessage(error)).to.deep.eq({a: error.response.data.message, b: error.message})
  })

  it('returns the message and first error if errors is an array', () => {
    const error = {message: 'Error!', response: { data: { message: 'Message!', errors: [{message: 'First error!'}, {message: 'Second error!'}] }}}
    expect(findDetailMessage(error)).to.deep.eq({a: error.response.data.errors[0].message, b: error.message})
  })
})

describe('isLoadingChunkError', () => {
  it('returns true if the string contains loading chunk text', () => {
    expect(isLoadingChunkError('loading chunk')).to.be.true
    expect(isLoadingChunkError('loading chunk error')).to.be.true
    expect(isLoadingChunkError('error loading chunk')).to.be.true
  })

  it('returns false if the string does not contain loading chunk text', () => {
    expect(isLoadingChunkError('loading')).to.be.false
    expect(isLoadingChunkError('chunk')).to.be.false
    expect(isLoadingChunkError('error loading')).to.be.false
    expect(isLoadingChunkError('loading error')).to.be.false
    expect(isLoadingChunkError('error chunk')).to.be.false
    expect(isLoadingChunkError('chunk error')).to.be.false
  })
})