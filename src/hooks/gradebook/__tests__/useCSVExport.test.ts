import {renderHook, waitFor} from '@testing-library/react'
import {expect, jest, describe, it, beforeEach, afterEach} from '@jest/globals'
import useCSVExport, {
  EXPORT_NOT_STARTED,
  EXPORT_PENDING,
  EXPORT_COMPLETE,
  EXPORT_FAILED,
} from '../useCSVExport'
import * as FlashAlert from '@components/FlashAlert'

jest.mock('@components/FlashAlert')

describe('useCSVExport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress act warnings for async state updates in IIFE
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (!msg.toString().includes('was not wrapped in act')) {
        console.warn(msg)
      }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('initializes with EXPORT_NOT_STARTED state', () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.resolve([]))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    expect(result.current.exportState).toBe(EXPORT_NOT_STARTED)
    expect(result.current.exportData).toEqual([])
  })

  it('sets EXPORT_PENDING state when exportGradebook is called', async () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => new Promise(() => {})) // Never resolves
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(result.current.exportState).toBe(EXPORT_PENDING)
    })
  })

  it('calls csvExportHandler when exportGradebook is invoked', async () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.resolve([{name: 'Test'}]))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })
  })

  it('sets EXPORT_COMPLETE state and updates exportData on successful export', async () => {
    const mockData = [{Student: 'Alice', Score: 95}, {Student: 'Bob', Score: 87}]
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.resolve(mockData))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(result.current.exportState).toBe(EXPORT_COMPLETE)
      expect(result.current.exportData).toEqual(mockData)
    })
  })

  it('sets EXPORT_FAILED state on export error', async () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.reject(new Error('Export failed')))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(result.current.exportState).toBe(EXPORT_FAILED)
    })
  })

  it('clears exportData on export error', async () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.reject(new Error('Export failed')))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(result.current.exportData).toEqual([])
    })
  })

  it('shows flash alert on export error', async () => {
    const mockHandler = jest.fn<() => Promise<object[]>>(() => Promise.reject(new Error('Export failed')))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()

    await waitFor(() => {
      expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
        message: 'Error exporting gradebook',
        type: 'error',
      })
    })
  })

  it('handles multiple export attempts', async () => {
    const mockData1 = [{name: 'First'}]
    const mockData2 = [{name: 'Second'}]
    const mockHandler = jest.fn<() => Promise<object[]>>()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)

    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    result.current.exportGradebook()
    await waitFor(() => {
      expect(result.current.exportData).toEqual(mockData1)
    })

    result.current.exportGradebook()
    await waitFor(() => {
      expect(result.current.exportData).toEqual(mockData2)
      expect(mockHandler).toHaveBeenCalledTimes(2)
    })
  })

  it('transitions through states correctly: NOT_STARTED -> PENDING -> COMPLETE', async () => {
    const mockData = [{test: 'data'}]
    let resolveHandler: (value: object[]) => void
    const mockHandler = jest.fn<() => Promise<object[]>>(
      () => new Promise((resolve) => {
        resolveHandler = resolve
      }))
    const {result} = renderHook(() => useCSVExport({csvExportHandler: mockHandler}))

    expect(result.current.exportState).toBe(EXPORT_NOT_STARTED)

    result.current.exportGradebook()

    await waitFor(() => {
      expect(result.current.exportState).toBe(EXPORT_PENDING)
    })

    // Now resolve the promise
    resolveHandler!(mockData)

    await waitFor(() => {
      expect(result.current.exportState).toBe(EXPORT_COMPLETE)
    })
  })
})
