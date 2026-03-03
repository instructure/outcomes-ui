import { createContext } from 'react'
import type { MasteryLevel } from '@/types/gradebook'

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

export interface GradebookConfig {
  masteryLevelConfig?: MasteryLevelConfig
}

export const GradebookConfigContext = createContext<GradebookConfig | null>(null)
