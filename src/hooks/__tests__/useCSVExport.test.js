import { expect } from 'chai'
import { renderHook } from '@testing-library/react-hooks/dom'
import sinon from 'sinon'
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
  let showFlashAlert
  beforeEach(() => { showFlashAlert = sinon.spy(Alerts, 'showFlashAlert') })
  afterEach(() => { showFlashAlert.restore() })
  const makeProps = (props) => {
    return {
      fetchCSVData: sinon.spy(),
      fetchingStatus: NOT_FETCHING,
      formatCSVData: sinon.spy(),
      ...props
    }
  }

  describe('initializes', () => {
    it('as not exporting', () => {
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      expect(result.current.exportState).to.equal(NOT_EXPORTING)
    })

    it('formattedData as an empty array', () => {
      const {result} = renderHook(() => useCSVExport({...makeProps({})}))
      expect(result.current.formattedData).to.be.empty
    })
  })

  describe('beginExport', () => {
    it('when called sets the exportState to fetching_data and calls fetchCSVData if this is the first fetch', () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(result.current.exportState).to.equal(FETCHING_DATA)
      expect(props.fetchCSVData).to.have.been.called
      expect(props.formatCSVData).to.not.have.been.called
    })

    it('when called sets the exportState to formatting_csv and calls formatCSVData if we have already completed a fetch', () => {
      const formattedData = [[{row1: 'row1'}]]
      const formatCSVDataMock = sinon.stub().returns(formattedData)
      const props = makeProps({fetchingStatus: COMPLETED, formatCSVData: formatCSVDataMock})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(result.current.exportState).to.equal(FORMATTING_CSV)
      expect(props.fetchCSVData).to.not.have.been.called
      expect(props.formatCSVData).to.have.been.called
    })

    it('calls showFlashAlert with the starting message', () => {
      const props = makeProps({})
      const {result} = renderHook(() => useCSVExport({...props}))
      result.current.beginExport()
      expect(showFlashAlert).to.have.been.calledWith(alertTypes.starting)
    })
  })

  it('sets the exportState to not_fetching if fetchCSVData throws an error', () => {
    const fetchCSVDataError = sinon.stub().rejects()
    const props = makeProps({fetchCSVData: fetchCSVDataError})
    const newProps = makeProps({fetchingStatus: ERROR})
    const hook = renderHook(() => useCSVExport({...props}))
    hook.result.current.beginExport()
    hook.rerender(newProps)
    hook.waitForNextUpdate(() => {
      expect(hook.result.current.exportState).to.equal(NOT_FETCHING)
    })
  })

  it('calls showFlashAlert with the error message', () => {
    const fetchCSVDataError = sinon.stub().rejects()
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
    expect(props.formatCSVData).to.not.have.been.called
  })

  it('does not call formatCSVData if fetching results in an error', () => {
    const fetchCSVDataError = sinon.stub().rejects()
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
    const formattedData = [[{row1: 'row1'}]]
    const formatCSVDataMock = sinon.stub().returns(formattedData)
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

  it('does not set the exportState to csv_complete if the formatted data is empty', () => {
    const formatCSVDataMock = sinon.stub().returns([])
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
