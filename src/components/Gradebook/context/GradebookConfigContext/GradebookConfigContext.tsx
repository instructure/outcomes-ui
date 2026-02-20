import { createContext, ComponentType } from 'react'
import type { MasteryLevel, Student, StudentMasteryScores } from '@/types/gradebook'

export interface StudentPopoverWrapperProps {
  studentName: string
  student?: Student
  courseId?: string
  masteryScores?: StudentMasteryScores
}

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
