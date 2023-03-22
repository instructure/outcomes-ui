import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@instructure/ui-buttons'
import { CSVLink } from 'react-csv'
import { Flex } from '@instructure/ui-flex'
import { ProgressBar } from '@instructure/ui-progress'
import { Text } from '@instructure/ui-text'
import { Transition } from '@instructure/ui-motion'
import t from 'format-message'
import useBoolean from '../../../hooks/useBoolean'
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
import { fileName, formatPercentage } from '../../../util/outcomesReportUtils'

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
  artifactId,
  focusedElement
}) => {
  const csvElementRef = useRef(null)
  const exportCSV = () => csvElementRef.current?.click()
  const [isShowingProgressBar, showProgressBar, hideProgressBar] = useBoolean(false)
  const [csvButtonRef, setCsvButtonRef] = useState(useRef(null))
  const {
    beginExport,
    cancelExport,
    exportState,
    progressValue,
    formattedData
  } = useCSVExport({
    fetchCSVData,
    fetchingStatus,
    formatCSVData,
    showProgressBar,
    hideProgressBar
  })

  const canStartExport = exportState === NOT_EXPORTING

  useEffect(() => {
    if (exportState === CSV_COMPLETE) {
      exportCSV()
      setTimeout(() => {
        if (focusedElement === csvButtonRef) {
          csvButtonRef.focus()
        }
      }, 3000)
    }
  }, [exportState])

  return (
    <Flex as='div' width='100%' alignItems='center' justifyItems='space-between'>
      <div style={{flex: 1, textAlign: 'start'}}>
        <Transition
          in={isShowingProgressBar}
          type='fade'
          unmountOnExit
        >
          <Text weight='bold' size='small' color='primary'>
            {t('Exporting')}
          </Text>
          <ProgressBar
            screenReaderLabel={t('Export CSV Percent Complete')}
            renderValue={({valueNow, valueMax}) => t('{percentDone}%', {percentDone: formatPercentage(valueNow, valueMax)})}
            formatScreenReaderValue={({valueNow, valueMax}) => t('{percentDone} percent', {percentDone: formatPercentage(valueNow, valueMax)})}
            valueNow={progressValue}
            data-automation='outcomesPerStudent_exportCSVProgressBar'
            margin='0 0 xx-small'
          />
        </Transition>
      </div>
      <Button
        margin='medium 0 medium 0'
        color={canStartExport ? 'primary' : 'secondary'}
        onClick={canStartExport ? beginExport : cancelExport}
        interaction={canStartExport ? 'enabled' : progressValue < 100 ? 'enabled' : 'disabled'}
        data-automation='outcomesPerStudent_exportCSVButton'
        buttonRef={(ref) => setCsvButtonRef(ref)}
      >
        {canStartExport ? t('Export CSV') : t('Cancel Export')}
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
  artifactId: PropTypes.string.isRequired,
  focusedElement: PropTypes.element,
}

ExportCSVButton.defaultProps = {
  focusedElement: null
}

export default ExportCSVButton