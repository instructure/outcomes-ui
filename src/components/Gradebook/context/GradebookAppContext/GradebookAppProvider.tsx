import React, { PropsWithChildren, useState } from 'react'
import { GradebookAppContextValue, GradebookAppContext, SaveSettingsResult } from './GradebookAppContext'

export interface GradebookAppProviderProps<TSettings> {
  settings: {
    settings: TSettings
    onSave: (settings: TSettings) => Promise<SaveSettingsResult>
  }
}

export const GradebookAppProvider = <TSettings,>({
  children,
  settings: {
    settings: originalSettings,
    onSave,
  },
}: PropsWithChildren<GradebookAppProviderProps<TSettings>>) => {
  const [ settings, setSettings ] = useState<TSettings>(originalSettings)

  const value: GradebookAppContextValue<TSettings> = {
    // If the settings will be implemented on the app level, we can remove this (MC won't use it)
    settings: {
      settings,
      setSettings,
      onSave,
    },
  }

  return (
    <GradebookAppContext.Provider value={value}>
      {children}
    </GradebookAppContext.Provider>
  )
}
