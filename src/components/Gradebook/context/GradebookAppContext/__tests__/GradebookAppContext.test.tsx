import React from 'react'
import { expect, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  GradebookAppProvider,
  useGradebookApp,
} from '..'

interface TestSettings {
  option1: boolean
  option2: string
}

const TestConsumer: React.FC = () => {
  const { settings: { settings, setSettings } } = useGradebookApp<TestSettings>()
  return (
    <div>
      <div data-testid="option1">{String(settings.option1)}</div>
      <div data-testid="option2">{settings.option2}</div>
      <button onClick={() => setSettings({ ...settings, option1: !settings.option1 })} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  )
}

describe('GradebookAppContext', () => {
  const mockSettingsData: TestSettings = {
    option1: true,
    option2: 'test',
  }

  const mockOnSave = jest.fn<(s: TestSettings) => Promise<import('..').SaveSettingsResult>>().mockResolvedValue({ success: true })
  const mockSettings = { settings: mockSettingsData, onSave: mockOnSave }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GradebookAppProvider', () => {
    it('provides settings to children', () => {
      render(
        <GradebookAppProvider settings={mockSettings}>
          <TestConsumer />
        </GradebookAppProvider>
      )

      expect(screen.getByTestId('option1')).toHaveTextContent('true')
      expect(screen.getByTestId('option2')).toHaveTextContent('test')
    })

    it('updates state when setSettings is called from consumer', () => {
      render(
        <GradebookAppProvider settings={mockSettings}>
          <TestConsumer />
        </GradebookAppProvider>
      )

      // Initial state
      expect(screen.getByTestId('option1')).toHaveTextContent('true')

      // Click toggle button
      const button = screen.getByTestId('toggle-button')
      fireEvent.click(button)

      // State should have changed
      expect(screen.getByTestId('option1')).toHaveTextContent('false')
      expect(screen.getByTestId('option2')).toHaveTextContent('test')
    })

    it('provides onSave when passed', () => {
      const customOnSave = jest.fn<(s: TestSettings) => Promise<import('..').SaveSettingsResult>>()
      const TestConsumerWithSave: React.FC = () => {
        const { settings: { onSave } } = useGradebookApp<TestSettings>()
        return (
          <button
            onClick={() => onSave({ option1: false, option2: 'new' })}
            data-testid="save-button"
          >
            Save
          </button>
        )
      }

      render(
        <GradebookAppProvider settings={{ settings: mockSettingsData, onSave: customOnSave }}>
          <TestConsumerWithSave />
        </GradebookAppProvider>
      )

      const button = screen.getByTestId('save-button')
      fireEvent.click(button)

      expect(customOnSave).toHaveBeenCalledWith({ option1: false, option2: 'new' })
    })
  })

  describe('useGradebookApp', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestConsumer />)
      }).toThrow('useGradebookApp must be used within GradebookAppProvider')

      consoleSpy.mockRestore()
    })

    it('returns app state when used inside provider', () => {
      render(
        <GradebookAppProvider settings={mockSettings}>
          <TestConsumer />
        </GradebookAppProvider>
      )

      expect(screen.getByTestId('option1')).toBeInTheDocument()
      expect(screen.getByTestId('option2')).toBeInTheDocument()
    })
  })
})
