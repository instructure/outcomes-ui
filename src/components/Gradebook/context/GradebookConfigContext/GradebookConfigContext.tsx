import { createContext } from 'react'

export interface GradebookUrlBuilders {}

export interface GradebookConfig {
  urlBuilders?: GradebookUrlBuilders
}

export const GradebookConfigContext = createContext<GradebookConfig | null>(null)
