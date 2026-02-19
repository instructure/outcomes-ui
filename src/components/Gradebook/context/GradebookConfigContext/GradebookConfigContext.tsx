import { createContext, ComponentType } from 'react'
import type { MasteryLevel } from '@/types/gradebook/rollup'
import type { StudentPopoverProps } from '@/components/Gradebook/popovers/StudentPopover'

export type StudentPopoverWrapperProps =
  Pick<StudentPopoverProps, 'student' | 'studentName' | 'courseId' | 'outcomes' | 'rollups'>

export interface GradebookComponents {
  StudentPopover: ComponentType<StudentPopoverWrapperProps>
}

export interface RenderSettingsProps<TSettings> {
  settings: TSettings
  onChange: (settings: TSettings) => void
}

export interface SaveSettingsResult {
  success: boolean
  error?: string
}

export interface SettingsConfig<TSettings> {
  settings: TSettings
  setSettings: (settings: TSettings) => void
  onSaveSettings: (settings: TSettings) => Promise<SaveSettingsResult>
  renderSettingsContent: (props: RenderSettingsProps<TSettings>) => React.ReactNode
}

export type MasteryLevelOverrides = Partial<Record<
  MasteryLevel,
  {
    name: string
  }
>>

export type MasteryLevelConfig = {
  availableLevels?: MasteryLevel[]
  masteryLevelOverrides?: MasteryLevelOverrides
}

export interface GradebookConfig<TSettings = object> {
  components: GradebookComponents
  settingsConfig: SettingsConfig<TSettings>
  masteryLevelConfig?: MasteryLevelConfig
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GradebookConfigContext = createContext<GradebookConfig<any> | null>(null)
