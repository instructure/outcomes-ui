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
  success: { message: t('CSV export has completed'), type: 'success', timeout: 5000 },
  error: { message: t('There was an error in fetching the data. Please try again.'), type: 'error', timeout: 5000 }
}

const useCSVExport = ({fetchCSVData, fetchingStatus, formatCSVData}) => {
  const [exportState, setExportState] = useState(NOT_EXPORTING)
  const [formattedData, setFormattedData] = useState([])

  useEffect(() => {
    if (exportState === FETCHING_DATA && fetchingStatus === COMPLETED) {
      formatData()
    } else if (exportState === FETCHING_DATA && fetchingStatus === ERROR) {
      showFlashAlert(alertTypes.error)
      setExportState(NOT_EXPORTING)
    }
  }, [fetchingStatus])

  useEffect(() => {
    if (exportState === FORMATTING_CSV && formattedData.length > 0) {
      showFlashAlert(alertTypes.success)
      setExportState(CSV_COMPLETE)
    }
  }, [exportState, formattedData])

  const beginExport = () => {
    showFlashAlert(alertTypes.starting)
    if (fetchingStatus === COMPLETED) {
      formatData()
    } else {
      fetchData()
    }
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
    exportState,
    formattedData
  }
}

useCSVExport.PropTypes = {
  fetchCSVData: PropTypes.func.isRequired,
  fetchingStatus: PropTypes.string.isRequired,
  formatCSVData: PropTypes.func.isRequired
}

export default useCSVExport
