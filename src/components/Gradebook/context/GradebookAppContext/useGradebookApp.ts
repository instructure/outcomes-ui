import { useContext } from 'react'
import { GradebookAppContextValue, GradebookAppContext } from './GradebookAppContext'

export const useGradebookApp = <TSettings>(): GradebookAppContextValue<TSettings> => {
  const context = useContext(GradebookAppContext)
  if (!context) {
    throw new Error('useGradebookApp must be used within GradebookAppProvider')
  }
  return context
}
