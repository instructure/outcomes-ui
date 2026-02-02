import React, {useRef, useEffect, useState} from 'react'
import {Button} from '@instructure/ui-buttons'
import {CSVLink} from 'react-csv'
import {IconExportLine} from '@instructure/ui-icons'
import useCSVExport, {
  EXPORT_COMPLETE,
  EXPORT_FAILED,
  EXPORT_PENDING,
} from '@hooks/gradebook/useCSVExport'
import t from 'format-message'

export interface ExportCSVButtonProps {
  csvFileName?: string
  csvExportHandler: () => Promise<object[]>
}

export const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  csvFileName,
  csvExportHandler,
}) => {
  const csvElementRef = useRef<HTMLSpanElement>(null)
  const exportCSV = (): void => csvElementRef.current?.click()

  const {exportGradebook, exportState, exportData} = useCSVExport({csvExportHandler})
  const [interaction, setInteraction] = useState<'enabled' | 'disabled'>('enabled')

  const onButtonClick = (): void => {
    setInteraction('disabled')
    exportGradebook()
  }

  useEffect(() => {
    if (exportState === EXPORT_COMPLETE) {
      exportCSV()
      setInteraction('enabled')
    } else if (exportState === EXPORT_FAILED) {
      setInteraction('enabled')
    }
  }, [exportState])

  return (
    <>
      <Button
        renderIcon={<IconExportLine />}
        onClick={onButtonClick}
        interaction={interaction}
        data-testid="export-button"
      >
        {exportState === EXPORT_PENDING ? t('Exporting') : t('Export')}
      </Button>
      <CSVLink
        data={exportData}
        filename={csvFileName || 'gradebook-export.csv'}
        data-testid="csv-link"
        style={{display: 'none'}}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span ref={csvElementRef} />
      </CSVLink>
    </>
  )
}
