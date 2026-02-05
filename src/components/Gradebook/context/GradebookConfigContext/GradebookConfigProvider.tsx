import React from 'react'
import { GradebookConfig, GradebookConfigContext } from './GradebookConfigContext'
export interface GradebookConfigProviderProps<TSettings> {
  children: React.ReactNode
  config: GradebookConfig<TSettings>
}

export const GradebookConfigProvider = <TSettings,>({
  children,
  config,
}: GradebookConfigProviderProps<TSettings>) => {
  return (
    <GradebookConfigContext.Provider value={config}>
      {children}
    </GradebookConfigContext.Provider>
  )
}
