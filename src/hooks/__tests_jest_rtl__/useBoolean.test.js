import { expect } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import useBoolean from '../useBoolean'

describe('useBoolean', () => {
  it('creates custom hook with state equal to initial value if initial value is boolean', () => {
    const {result} = renderHook(() => useBoolean(false))
    expect(result.current[0]).toEqual(false)
  })

  it('creates custom hook with state equal to initial value coerced to boolean if initial value is not boolean', () => {
    const {result} = renderHook(() => useBoolean('abc'))
    expect(result.current[0]).toEqual(true)
  })

  it('changes state to true when first exported fn is called', async () => {
    const {result} = renderHook(() => useBoolean())
    await act(async () => {
      result.current[1]()
    })
    expect(result.current[0]).toEqual(true)
  })

  it('changes state to false when second exported fn is called', async () => {
    const {result} = renderHook(() => useBoolean())
    await act(async () => {
      result.current[2]()
    })
    expect(result.current[0]).toEqual(false)
  })
})
