import { createContext } from 'react'

export interface GradebookUrlBuilders {}

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
export interface GradebookConfig<TSettings = object> {
  urlBuilders?: GradebookUrlBuilders
  settingsConfig: SettingsConfig<TSettings>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GradebookConfigContext = createContext<GradebookConfig<any> | null>(null)
