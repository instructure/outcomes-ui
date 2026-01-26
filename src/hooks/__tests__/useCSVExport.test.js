import { expect, jest } from '@jest/globals'
import { renderHook, waitFor, act } from '@testing-library/react'
import useCSVExport, {
  NOT_EXPORTING,
  FETCHING_DATA,
  FORMATTING_CSV,
  CSV_COMPLETE,
  alertTypes
} from '../useCSVExport'
import { NOT_FETCHING, COMPLETED, IN_PROGRESS, ERROR } from '../../constants'
import * as Alerts from '../../components/FlashAlert'

describe('useCSVExport', () => {

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const makeProps = (props) => {
    return {
      fetchCSVData: jest.fn(),
      fetchingStatus: NOT_FETCHING,
      formatCSVData: jest.fn(),
      showProgressBar: jest.fn(),
      hideProgressBar: jest.fn(),
      ...props
    }
  }

  describe('initializes', () => {
    it('as not exporting', () => {
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      expect(result.current.exportState).toEqual(NOT_EXPORTING)
    })

    it('formattedData as an empty array', () => {
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      expect(result.current.formattedData).toHaveLength(0)
    })
  })

  describe('beginExport', () => {
    it('when called sets the exportState to fetching_data and calls fetchCSVData if this is the first fetch', async () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      await act(async () => {
        result.current.beginExport()
      })
      await waitFor(() => {
        expect(result.current.exportState).toEqual(FETCHING_DATA)
      })
      expect(props.fetchCSVData).toHaveBeenCalled()
      expect(props.formatCSVData).not.toHaveBeenCalled()
    })

    it('when called sets the exportState to formatting_csv and calls formatCSVData if we have already completed a fetch', async () => {
      const formattedData = [[{row1: 'row1'}]]
      const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
      const props = makeProps({fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock})
      const {result} = renderHook(() => useCSVExport({...props}))
      await act(async () => {
        result.current.beginExport()
      })
      await waitFor(() => {
        expect(result.current.exportState).toEqual(FORMATTING_CSV)
      })
      expect(props.fetchCSVData).not.toHaveBeenCalled()
      expect(props.formatCSVData).toHaveBeenCalled()
    })

    it('calls showFlashAlert with the starting message', async () => {
      const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      await act(async () => {
        result.current.beginExport()
      })
      await waitFor(() => {
        expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.starting)
      })
    })

    it('calls showProgressBar', async () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      await act(async () => {
        result.current.beginExport()
      })
      await waitFor(() => {
        expect(props.showProgressBar).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('cancelExport sets the exportState to not_exporting and calls hideProgressBar and shows the cancelled alert', async () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const props = makeProps({})
    const {result} = renderHook(() => useCSVExport({...props}))
    await act(async () => {
      result.current.beginExport()
      result.current.cancelExport()
    })
    await waitFor(() => {
      expect(result.current.exportState).toEqual(NOT_EXPORTING)
    })
    expect(props.hideProgressBar).toHaveBeenCalledTimes(1)
    expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.cancelled)
  })

  it('sets the exportState to not_exporting if fetchCSVData throws an error', async () => {
    const props = makeProps({fetchCSVData: jest.fn()})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender({ ...props, fetchingStatus: ERROR })
    await waitFor(() => {
      expect(hook.result.current.exportState).toEqual(NOT_EXPORTING)
    })
  })

  it('calls showFlashAlert with the error message', async () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const fetchCSVDataError = jest.fn()
    const props = makeProps({fetchCSVData: fetchCSVDataError})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender({ ...props, fetchingStatus: ERROR })
    await waitFor(() => {
      expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.error)
    })
  })

  it('does not call formatCSVData if fetchingStatus is still in progress', async () => {
    const newProps = makeProps({fetchingStatus: IN_PROGRESS})
    const hook = renderHook(() => useCSVExport({...makeProps({})}))
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender(newProps)
    await waitFor(() => {
      expect(hook.result.current.exportState).toEqual(FETCHING_DATA)
    })
    expect(newProps.formatCSVData).not.toHaveBeenCalled()
  })

  it('does not call formatCSVData if we are no longer fetching and did not complete', async () => {
    const newProps = makeProps({fetchingStatus: NOT_FETCHING})
    const hook = renderHook(() => useCSVExport({...makeProps({})}))
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender(newProps)

    await waitFor(() => {
      expect(hook.result.current.exportState).toEqual(FETCHING_DATA)
    })
    expect(newProps.formatCSVData).not.toHaveBeenCalled()
  })

  it('does not call formatCSVData if there is no export happening', () => {
    const props = makeProps({fetchingStatus: COMPLETED})
    renderHook(() => useCSVExport({...props}))
    expect(props.formatCSVData).not.toHaveBeenCalled()
  })

  it('does not call formatCSVData if fetching results in an error', async () => {
    const fetchCSVDataError = jest.fn()
    const props = makeProps({fetchCSVData: fetchCSVDataError})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    const newProps = makeProps({fetchingStatus: ERROR})
    hook.rerender(newProps)

    await waitFor(() => {
      expect(hook.result.current.exportState).toEqual(NOT_EXPORTING)
    })
    expect(newProps.formatCSVData).not.toHaveBeenCalled()
  })

  it('sets the exportState to csv_complete when the data is formatted and shows the success alert', async () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const formattedData = [[{row1: 'row1'}]]
    const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender({ ...props, fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock })

    await waitFor(() => {
      expect(hook.result.current.formattedData).toEqual(formattedData)
    })

    // The hook uses setTimeout to increment progressValue, need to wait for progressValue to reach 90+
    // Then the effect checks formattedData.length > 0 and sets CSV_COMPLETE
    await waitFor(
      () => {
        expect(hook.result.current.exportState).toEqual(CSV_COMPLETE)
      },
      { timeout: 5000 }
    )

    expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.success)
  })

  it('hides the progress bar and sets exportState to not_exporting once we have exported', async () => {
    const formattedData = [[{row1: 'row1'}]]
    const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender({ ...props, fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock })

    await waitFor(
      () => {
        expect(hook.result.current.exportState).toEqual(CSV_COMPLETE)
      },
      { timeout: 5000 }
    )

    // Advance timers past the 3-second delay
    await act(async () => jest.advanceTimersByTime(3000))

    await waitFor(() => {
      expect(props.hideProgressBar).toHaveBeenCalledTimes(1)
      expect(hook.result.current.exportState).toEqual(NOT_EXPORTING)
    })
  })

  it('does not set the exportState to csv_complete if the formatted data is empty', async () => {
    const formatCSVDataMock = jest.fn().mockReturnValue([])
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const hook = renderHook(
      props => useCSVExport({ ...props }),
      { initialProps: props }
    )
    await act(async () => {
      hook.result.current.beginExport()
    })
    hook.rerender({ ...props, fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock })

    await waitFor(() => {
      expect(hook.result.current.exportState).toEqual(FORMATTING_CSV)
    })
    expect(hook.result.current.exportState).not.toEqual(CSV_COMPLETE)
  })
})
