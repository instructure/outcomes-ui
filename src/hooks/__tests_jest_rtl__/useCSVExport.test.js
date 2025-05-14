import { expect, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks/dom'
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
    it('when called sets the exportState to fetching_data and calls fetchCSVData if this is the first fetch', () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(result.current.exportState).toEqual(FETCHING_DATA)
      expect(props.fetchCSVData).toHaveBeenCalled()
      expect(props.formatCSVData).not.toHaveBeenCalled()
    })

    it('when called sets the exportState to formatting_csv and calls formatCSVData if we have already completed a fetch', () => {
      const formattedData = [[{row1: 'row1'}]]
      const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
      const props = makeProps({fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(result.current.exportState).toEqual(FORMATTING_CSV)
      expect(props.fetchCSVData).not.toHaveBeenCalled()
      expect(props.formatCSVData).toHaveBeenCalled()
    })

    it('calls showFlashAlert with the starting message', () => {
      const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      result.current.beginExport()
      expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.starting)
    })

    it('calls showProgressBar', () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(props.showProgressBar).toHaveBeenCalledTimes(1)
    })
  })

  it('cancelExport sets the exportState to not_exporting and calls hideProgressBar and shows the cancelled alert', () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const props = makeProps({})
    const {result} = renderHook(() => useCSVExport({...props}))
    result.current.beginExport()
    result.current.cancelExport()
    expect(result.current.exportState).toEqual(NOT_EXPORTING)
    expect(props.hideProgressBar).toHaveBeenCalledTimes(1)
    expect(showFlashAlert).toHaveBeenCalledWith(alertTypes.cancelled)
  })

  it('sets the exportState to not_fetching if fetchCSVData throws an error', () => {
    const props = makeProps({fetchCSVData: jest.fn()})
    const newProps = makeProps({fetchingStatus: ERROR})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(hook.result.current.exportState).toEqual(NOT_FETCHING)
    })
  })

  it('calls showFlashAlert with the error message', () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const fetchCSVDataError = jest.fn()
    const props = makeProps({fetchCSVData: fetchCSVDataError})
    const newProps = makeProps({fetchingStatus: ERROR})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(showFlashAlert).to.have.been.calledWith(alertTypes.error)
    })
  })

  it('does not call formatCSVData if fetchingStatus is still in progress', () => {
    const newProps = makeProps({fetchingStatus: IN_PROGRESS})
    const hook = renderHook(() => useCSVExport({...makeProps({})}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(hook.result.current.exportState).to.equal(FETCHING_DATA)
      expect(newProps.formatCSVData).to.not.have.been.called
    })
  })

  it('does not call formatCSVData if we are no longer fetching and did not complete', () => {
    const newProps = makeProps({fetchingStatus: NOT_FETCHING})
    const hook = renderHook(() => useCSVExport({...makeProps({})}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(newProps.formatCSVData).to.not.have.been.called
    })
  })

  it('does not call formatCSVData if there is no export happening', () => {
    const props = makeProps({fetchingStatus: COMPLETED})
    renderHook(() => useCSVExport({...props}))
    expect(props.formatCSVData).not.toHaveBeenCalled()
  })

  it('does not call formatCSVData if fetching results in an error', () => {
    const fetchCSVDataError = jest.fn()
    const props = makeProps({fetchCSVData: fetchCSVDataError})
    const newProps = makeProps({fetchingStatus: ERROR})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(newProps.formatCSVData).to.not.have.been.called
    })
  })

  it('sets the exportState to csv_complete when the data is formatted and shows the success alert', () => {
    const showFlashAlert = jest.spyOn(Alerts, 'showFlashAlert')
    const formattedData = [[{row1: 'row1'}]]
    const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const newProps = makeProps({fetchingStatus: COMPLETED})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(hook.result.current.formattedData).to.deep.equal(formattedData)
      expect(hook.result.current.exportState).to.equal(CSV_COMPLETE)
      expect(showFlashAlert).to.have.been.calledWith(alertTypes.success)
    })
  })

  it('hides the progress bar and sets exportState to not_exporting once we have exported', () => {
    const formattedData = [[{row1: 'row1'}]]
    const formatCSVDataMock = jest.fn().mockReturnValue(formattedData)
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const newProps = makeProps({fetchingStatus: COMPLETED})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      jest.advanceTimersByTime(2000)
      expect(newProps.hideProgressBar).to.have.been.calledOnce
      expect(hook.result.exportState).to.equal(NOT_EXPORTING)
    })
  })

  it('does not set the exportState to csv_complete if the formatted data is empty', () => {
    const formatCSVDataMock = jest.fn().mockReturnValue([])
    const props = makeProps({formatCSVData: formatCSVDataMock})
    const newProps = makeProps({fetchingStatus: COMPLETED})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(hook.result.current.exportState).to.not.equal(CSV_COMPLETE)
    })
  })
})
