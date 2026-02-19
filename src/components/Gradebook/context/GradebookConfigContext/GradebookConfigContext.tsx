import { createContext, ComponentType } from 'react'
import type { MasteryLevel } from '@/types/gradebook/rollup'
import type { StudentPopoverProps } from '@/components/Gradebook/popovers/StudentPopover'

export type StudentPopoverWrapperProps =
  Pick<StudentPopoverProps, 'student' | 'studentName' | 'courseId' | 'outcomes' | 'rollups'>

export interface SettingsTrayContentProps<TSettings> {
  settings: TSettings
  onChange: (settings: TSettings) => void
}

export interface GradebookComponents<TSettings = object> {
  StudentPopover: ComponentType<StudentPopoverWrapperProps>
  SettingsTrayContent: ComponentType<SettingsTrayContentProps<TSettings>>
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
  components: GradebookComponents<TSettings>
  masteryLevelConfig?: MasteryLevelConfig
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GradebookConfigContext = createContext<GradebookConfig<any> | null>(null)
