import React from 'react'
import { GradebookConfig, GradebookConfigContext } from './GradebookConfigContext'

export interface GradebookConfigProviderProps {
  children: React.ReactNode
  config: GradebookConfig
}

export const GradebookConfigProvider: React.FC<GradebookConfigProviderProps> = ({
  children,
  config,
}) => {
  return (
    <GradebookConfigContext.Provider value={config}>
      {children}
    </GradebookConfigContext.Provider>
  )
}
