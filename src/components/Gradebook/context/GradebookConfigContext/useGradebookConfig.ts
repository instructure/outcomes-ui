import { useContext } from 'react'
import { GradebookConfig, GradebookConfigContext } from './GradebookConfigContext'

export const useGradebookConfig = <TSettings>(): GradebookConfig<TSettings> => {
  const context = useContext(GradebookConfigContext)
  if (!context) {
    throw new Error('useGradebookConfig must be used within GradebookConfigProvider')
  }
  return context
}
