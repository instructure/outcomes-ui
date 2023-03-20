import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@instructure/ui-buttons'
import { CSVLink } from 'react-csv'
import { Flex } from '@instructure/ui-flex'
import t from 'format-message'
import useCSVExport, {
  NOT_EXPORTING,
  CSV_COMPLETE
} from '../../../hooks/useCSVExport'
import {
  STUDENT_NAME,
  STUDENT_UUID,
  ATTEMPT_COUNT,
  ALIGNED_QUESTIONS_COUNT,
  LOR_POINTS,
  LOR_POINTS_POSSIBLE,
  LO_NAME,
  LO_ID,
  LO_MASTERY_PERCENT,
  LO_MASTERED
} from '../../../constants'
import { fileName } from '../../../util/outcomesReportUtils'

export const headers = [
  { label: t('Student Name'), key: STUDENT_NAME },
  { label: t('Student UUID'), key: STUDENT_UUID },
  { label: t('Number of Attempts'), key: ATTEMPT_COUNT },
  { label: t('Number of Aligned Questions'), key: ALIGNED_QUESTIONS_COUNT },
  { label: t('Learning Outcome Result Points'), key: LOR_POINTS },
  { label: t('Learning Outcome Result Points Possible'), key: LOR_POINTS_POSSIBLE },
  { label: t('Learning Outcome Name'), key: LO_NAME },
  { label: t('Learning Outcome ID'), key: LO_ID },
  { label: t('Learning Outcome Mastery Percent'), key: LO_MASTERY_PERCENT },
  { label: t('Learning Outcome Mastered'), key: LO_MASTERED }
]

const ExportCSVButton = ({
  fetchCSVData,
  formatCSVData,
  fetchingStatus,
  artifactId
}) => {
  const csvElementRef = useRef(null)
  const exportCSV = () => csvElementRef.current?.click()

  const {
    beginExport,
    exportState,
    formattedData
  } = useCSVExport({fetchCSVData, fetchingStatus, formatCSVData})

  useEffect(() => {
    if (exportState === CSV_COMPLETE) {
      exportCSV()
    }
  }, [exportState])

  const handleButtonInteraction = () => {
    const canStartExport = exportState === NOT_EXPORTING || exportState === CSV_COMPLETE
    return canStartExport ? 'enabled' : 'disabled'
  }

  return (
    <Flex as='div' width='100%' justifyItems='end'>
      <Button
        margin='medium 0 medium 0'
        color='primary'
        onClick={beginExport}
        interaction={handleButtonInteraction()}
        data-automation='outcomesPerStudent_exportCSVButton'
      >
        {t('Export CSV')}
      </Button>
      <span aria-hidden={true}>
        <CSVLink
          data={formattedData}
          headers={headers}
          filename={fileName(artifactId)}
          tabIndex={-1}
        >
          <span ref={csvElementRef} />
        </CSVLink>
      </span>
    </Flex>
  )
}

ExportCSVButton.propTypes = {
  fetchCSVData: PropTypes.func.isRequired,
  formatCSVData: PropTypes.func.isRequired,
  fetchingStatus: PropTypes.string.isRequired,
  artifactId: PropTypes.string.isRequired
}

export default ExportCSVButton