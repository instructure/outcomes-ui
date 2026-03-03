import React from 'react'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {
  GradebookConfigProvider,
  useGradebookConfig,
  type GradebookConfig,
} from '..'
import type { MasteryLevel } from '@/types/gradebook'

// Test component that uses the config hook
const TestConfigConsumer: React.FC = () => {
  const config = useGradebookConfig()
  return (
    <div data-testid="config-consumer">
      {config.masteryLevelConfig ? 'has-mastery-config' : 'no-mastery-config'}
    </div>
  )
}

// Test component that uses the mastery level config
const TestMasteryLevelConsumer: React.FC = () => {
  const config = useGradebookConfig()
  const availableLevels = config.masteryLevelConfig?.availableLevels?.length || 0
  return <div data-testid="mastery-level-count">{availableLevels}</div>
}

const DEFAULT_CONFIG: GradebookConfig = {}

const CONFIG_WITH_MASTERY: GradebookConfig = {
  masteryLevelConfig: {
    availableLevels: ['exceeds_mastery', 'mastery', 'near_mastery'] as MasteryLevel[],
  },
}

describe('GradebookConfigContext', () => {
  describe('GradebookConfigProvider', () => {
    it('provides config to children', () => {
      render(
        <GradebookConfigProvider config={CONFIG_WITH_MASTERY}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-mastery-config')
    })

    it('allows empty config', () => {
      render(
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toBeInTheDocument()
      expect(screen.getByTestId('config-consumer')).toHaveTextContent('no-mastery-config')
    })

    it('provides mastery level config when specified', () => {
      render(
        <GradebookConfigProvider config={CONFIG_WITH_MASTERY}>
          <TestMasteryLevelConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('mastery-level-count')).toHaveTextContent('3')
    })
  })

  describe('useGradebookConfig', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestConfigConsumer />)
      }).toThrow('useGradebookConfig must be used within GradebookConfigProvider')

      consoleSpy.mockRestore()
    })

    it('returns config when used inside provider', () => {
      render(
        <GradebookConfigProvider config={CONFIG_WITH_MASTERY}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-mastery-config')
    })
  })

  describe('masteryLevelConfig', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestMasteryLevelConsumer />)
      }).toThrow('useGradebookConfig must be used within GradebookConfigProvider')

      consoleSpy.mockRestore()
    })

    it('returns mastery level config when provided', () => {
      render(
        <GradebookConfigProvider config={CONFIG_WITH_MASTERY}>
          <TestMasteryLevelConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('mastery-level-count')).toHaveTextContent('3')
    })
  })
})
