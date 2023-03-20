import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { COMPLETED, ERROR } from '../constants'

export const NOT_EXPORTING = 'not_exporting'
export const FETCHING_DATA = 'fetching_data'
export const FORMATTING_CSV = 'formatting_csv'
export const CSV_COMPLETE = 'csv_complete'

const useCSVExport = ({fetchCSVData, fetchingStatus, formatCSVData}) => {
  const [exportState, setExportState] = useState(NOT_EXPORTING)
  const [formattedData, setFormattedData] = useState([])

  useEffect(() => {
    if (exportState === FETCHING_DATA && fetchingStatus === COMPLETED) {
      formatData()
    } else if (exportState === FETCHING_DATA && fetchingStatus === ERROR) {
      setExportState(NOT_EXPORTING)
    }
  }, [fetchingStatus])

  useEffect(() => {
    if (exportState === FORMATTING_CSV && formattedData.length > 0) {
      setExportState(CSV_COMPLETE)
    }
  }, [exportState, formattedData])

  const beginExport = () => {
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
