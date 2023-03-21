import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { COMPLETED, ERROR } from '../constants'
import { showFlashAlert } from '../components/FlashAlert'

export const NOT_EXPORTING = 'not_exporting'
export const FETCHING_DATA = 'fetching_data'
export const FORMATTING_CSV = 'formatting_csv'
export const CSV_COMPLETE = 'csv_complete'

export const alertTypes = {
  starting: { message: t('CSV export has started. This may take a few minutes.'), type: 'success', timeout: 5000 },
  cancelled: { message: t('Your CSV export has been cancelled'), type: 'info', timeout: 5000},
  success: { message: t('CSV export has completed'), type: 'success', timeout: 5000 },
  error: { message: t('There was an error in fetching the data. Please try again.'), type: 'error', timeout: 5000 }
}

const useCSVExport = ({fetchCSVData, fetchingStatus, formatCSVData, showProgressBar, hideProgressBar}) => {
  const [exportState, setExportState] = useState(NOT_EXPORTING)
  const [formattedData, setFormattedData] = useState([])
  const [progressValue, setProgressValue] = useState(0)
  const incrementProgressValue = () => setProgressValue(prevValue => prevValue + 1)

  useEffect(() => {
    if (exportState === FETCHING_DATA && fetchingStatus === COMPLETED) {
      formatData()
    } else if (exportState === FETCHING_DATA && fetchingStatus === ERROR) {
      hideProgressBar()
      showFlashAlert(alertTypes.error)
      setExportState(NOT_EXPORTING)
    }
  }, [fetchingStatus])

  useEffect(() => {
    if ((exportState === FETCHING_DATA || exportState === FORMATTING_CSV) && progressValue < 90) {
      setTimeout(() => {
        incrementProgressValue()
      }, 1)
    } else if (exportState === FORMATTING_CSV && formattedData.length > 0) {
      setProgressValue(100)
      showFlashAlert(alertTypes.success)
      setExportState(CSV_COMPLETE)
      setTimeout(() => {
        hideProgressBar()
        setExportState(NOT_EXPORTING)
      }, 2000)
    }
  }, [exportState, formattedData, progressValue])

  const beginExport = () => {
    showProgressBar()
    showFlashAlert(alertTypes.starting)
    if (fetchingStatus === COMPLETED) {
      formatData()
    } else {
      fetchData()
    }
  }

  const cancelExport = () => {
    showFlashAlert(alertTypes.cancelled)
    setExportState(NOT_EXPORTING)
    hideProgressBar()
  }

  const fetchData = () => {
    setExportState(FETCHING_DATA)
    fetchCSVData()
  }

  const formatData = () => {
    setExportState(FORMATTING_CSV)
    setFormattedData(formatCSVData())
  }

  return {
    beginExport,
    cancelExport,
    exportState,
    progressValue,
    formattedData
  }
}

useCSVExport.PropTypes = {
  fetchCSVData: PropTypes.func.isRequired,
  fetchingStatus: PropTypes.string.isRequired,
  formatCSVData: PropTypes.func.isRequired,
  showProgressBar: PropTypes.func.isRequired,
  hideProgressBar: PropTypes.func.isRequired
}

export default useCSVExport
