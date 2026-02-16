import React from 'react'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {
  GradebookConfigProvider,
  useGradebookConfig,
  type GradebookConfig,
} from '..'

// Test component that uses the config hook
const TestConfigConsumer: React.FC = () => {
  const config = useGradebookConfig()
  return (
    <div data-testid="config-consumer">
      {config.components.StudentPopover ? 'has-student-popover' : 'no-student-popover'}
    </div>
  )
}

// Test component that uses the components
const TestComponentsConsumer: React.FC = () => {
  const config = useGradebookConfig()
  const components = config.components
  const componentCount = Object.keys(components).length
  return <div data-testid="component-count">{componentCount}</div>
}

const DEFAULT_CONFIG: GradebookConfig = {
  components: {
    StudentPopover: () => <div>Mock StudentPopover</div>,
  },
  settingsConfig: {
    settings: {},
    setSettings: () => {},
    onSaveSettings: async () => ({ success: true }),
    renderSettingsContent: () => <div>Settings Content</div>,
  },
}

describe('GradebookConfigContext', () => {
  describe('GradebookConfigProvider', () => {
    it('provides config to children', () => {
      render(
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-student-popover')
    })

    it('requires components field', () => {
      render(
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toBeInTheDocument()
      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-student-popover')
    })

    it('requires StudentPopover in components', () => {
      render(
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestComponentsConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('component-count')).toHaveTextContent('1')
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
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-student-popover')
    })
  })

  describe('components', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponentsConsumer />)
      }).toThrow('useGradebookConfig must be used within GradebookConfigProvider')

      consoleSpy.mockRestore()
    })

    it('returns components when provided', () => {
      render(
        <GradebookConfigProvider config={DEFAULT_CONFIG}>
          <TestComponentsConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('component-count')).toHaveTextContent('1')
    })
  })
})
