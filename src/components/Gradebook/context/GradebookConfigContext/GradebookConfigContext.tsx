import { createContext } from 'react'
import { LmgbUserDetails } from '@/hooks/gradebook/useLmgbUserDetails'
import type { MasteryLevel } from '@/types/gradebook/rollup'

export interface GradebookUrlBuilders {}

export interface GradebookApiHandlers {
  userDetailsQuery?: (courseId: string, studentId: string) => Promise<LmgbUserDetails>,
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
  resources?: {
    urlBuilders?: GradebookUrlBuilders
    apiHandlers?: GradebookApiHandlers
  }
  settingsConfig: SettingsConfig<TSettings>
  masteryLevelConfig?: MasteryLevelConfig
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GradebookConfigContext = createContext<GradebookConfig<any> | null>(null)
