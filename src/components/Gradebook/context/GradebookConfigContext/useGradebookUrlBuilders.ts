import { useContext } from 'react'
import { GradebookConfig, GradebookConfigContext, GradebookUrlBuilders } from './GradebookConfigContext'

export const useGradebookConfig = (): GradebookConfig => {
  const context = useContext(GradebookConfigContext)
  if (!context) {
    throw new Error('useGradebookConfig must be used within GradebookConfigProvider')
  }
  return context
}

export const useGradebookUrlBuilders = (): GradebookUrlBuilders => {
  const config = useGradebookConfig()
  return config.urlBuilders || {}
}
