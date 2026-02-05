import React from 'react'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {
  GradebookConfigProvider,
  useGradebookConfig,
  useGradebookUrlBuilders,
  type GradebookConfig,
} from '..'

// Test component that uses the config hook
const TestConfigConsumer: React.FC = () => {
  const config = useGradebookConfig()
  return (
    <div data-testid="config-consumer">
      {config.urlBuilders ? 'has-url-builders' : 'no-url-builders'}
    </div>
  )
}

// Test component that uses the URL builders hook
const TestUrlBuilderConsumer: React.FC = () => {
  const urlBuilders = useGradebookUrlBuilders()
  const builderCount = Object.keys(urlBuilders).length
  return <div data-testid="builder-count">{builderCount}</div>
}

describe('GradebookConfigContext', () => {
  describe('GradebookConfigProvider', () => {
    it('provides config to children', () => {
      const config: GradebookConfig = {
        urlBuilders: {},
      }

      render(
        <GradebookConfigProvider config={config}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-url-builders')
    })

    it('accepts empty config object', () => {
      render(
        <GradebookConfigProvider config={{}}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toBeInTheDocument()
      expect(screen.getByTestId('config-consumer')).toHaveTextContent('no-url-builders')
    })

    it('accepts config with empty urlBuilders', () => {
      const config: GradebookConfig = {
        urlBuilders: {},
      }

      render(
        <GradebookConfigProvider config={config}>
          <TestUrlBuilderConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('builder-count')).toHaveTextContent('0')
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
      const config: GradebookConfig = {
        urlBuilders: {},
      }

      render(
        <GradebookConfigProvider config={config}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-url-builders')
    })
  })

  describe('useGradebookUrlBuilders', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestUrlBuilderConsumer />)
      }).toThrow('useGradebookConfig must be used within GradebookConfigProvider')

      consoleSpy.mockRestore()
    })

    it('returns empty object when no URL builders provided', () => {
      render(
        <GradebookConfigProvider config={{}}>
          <TestUrlBuilderConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('builder-count')).toHaveTextContent('0')
    })

    it('returns empty urlBuilders when provided as empty object', () => {
      const config: GradebookConfig = {
        urlBuilders: {},
      }

      render(
        <GradebookConfigProvider config={config}>
          <TestUrlBuilderConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('builder-count')).toHaveTextContent('0')
    })
  })

  describe('config updates', () => {
    it('re-renders when config changes', () => {
      const config1: GradebookConfig = {
        urlBuilders: {},
      }

      const config2: GradebookConfig = {}

      const { rerender } = render(
        <GradebookConfigProvider config={config1}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('has-url-builders')

      rerender(
        <GradebookConfigProvider config={config2}>
          <TestConfigConsumer />
        </GradebookConfigProvider>
      )

      expect(screen.getByTestId('config-consumer')).toHaveTextContent('no-url-builders')
    })
  })

  // TODO: Add URL builder tests when specific builders are implemented
  // describe('URL builders', () => {
  //   it('buildStudentGradesUrl generates correct URL', () => {
  //     ...
  //   })
  // })
})
