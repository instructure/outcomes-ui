import {useState} from 'react'
import {showFlashAlert} from '@components/FlashAlert'
import t from 'format-message'

export const EXPORT_NOT_STARTED = 'EXPORT_NOT_STARTED'
export const EXPORT_PENDING = 'EXPORT_PENDING'
export const EXPORT_COMPLETE = 'EXPORT_COMPLETE'
export const EXPORT_FAILED = 'EXPORT_FAILED'

export type ExportState =
  | typeof EXPORT_NOT_STARTED
  | typeof EXPORT_PENDING
  | typeof EXPORT_COMPLETE
  | typeof EXPORT_FAILED

interface CSVExportProps {
  csvExportHandler: () => Promise<object[]>
}

interface CSVExportHook {
  exportGradebook: () => void
  exportState: ExportState
  exportData: object[]
}

export default function useCSVExport({csvExportHandler}: CSVExportProps): CSVExportHook {
  const [exportState, setExportState] = useState<ExportState>(EXPORT_NOT_STARTED)
  const [exportData, setExportData] = useState<object[]>([])

  const exportGradebook = (): void => {
    ;(async () => {
      try {
        setExportState(EXPORT_PENDING)
        const csvExportResults = await csvExportHandler()
        setExportData(csvExportResults)
        setExportState(EXPORT_COMPLETE)
      } catch {
        setExportData([])
        setExportState(EXPORT_FAILED)
        showFlashAlert({
          message: t('Error exporting gradebook'),
          type: 'error',
        })
      }
    })()
  }

  return {
    exportGradebook,
    exportState,
    exportData,
  }
}
