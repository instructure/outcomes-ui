import { createContext } from 'react'

export interface SaveSettingsResult {
  success: boolean
  error?: string
}

export interface GradebookAppContextValue<TSettings = object> {
  settings: {
    settings: TSettings
    setSettings: (settings: TSettings) => void
    onSave: (settings: TSettings) => Promise<SaveSettingsResult>
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GradebookAppContext = createContext<GradebookAppContextValue<any> | null>(null)
