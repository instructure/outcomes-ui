import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {SettingsTray} from '../index'
import {
  GradebookConfigProvider,
} from '@/components/Gradebook/context/GradebookConfigContext'
import {
  GradebookConfig,
  SaveSettingsResult,
} from '@/components/Gradebook/context/GradebookConfigContext/GradebookConfigContext'
import * as FlashAlert from '@/components/FlashAlert'

jest.mock('@/components/FlashAlert')

interface TestSettings {
  option1: boolean
  option2: string
}

describe('SettingsTray', () => {
  const defaultSettings: TestSettings = {
    option1: true,
    option2: 'test',
  }

  const createConfig = (overrides = {}): GradebookConfig<TestSettings> => ({
    settingsConfig: {
      settings: defaultSettings,
      setSettings: jest.fn<(settings: TestSettings) => void>(),
      onSaveSettings: jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: true}),
      renderSettingsContent: jest.fn(({settings, onChange}) => (
        <div>
          <label htmlFor="option1">
            Option 1
            <input
              id="option1"
              type="checkbox"
              checked={settings.option1}
              onChange={(e) => onChange({...settings, option1: e.target.checked})}
            />
          </label>
          <label htmlFor="option2">
            Option 2
            <input
              id="option2"
              type="text"
              value={settings.option2}
              onChange={(e) => onChange({...settings, option2: e.target.value})}
            />
          </label>
        </div>
      )),
      ...overrides,
    },
  })

  const renderWithConfig = (props = {}, configOverrides = {}) => {
    const config = createConfig(configOverrides)
    return render(
      <GradebookConfigProvider config={config}>
        <SettingsTray open={false} onDismiss={jest.fn()} {...props} />
      </GradebookConfigProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the tray when open', () => {
      renderWithConfig({open: true})
      expect(screen.getByTestId('lmgb-settings-tray')).toBeInTheDocument()
    })

    it('renders the settings header', () => {
      renderWithConfig({open: true})
      expect(screen.getByTestId('lmgb-settings-header')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('renders the close button', () => {
      renderWithConfig({open: true})
      expect(screen.getByTestId('lmgb-close-settings-button')).toBeInTheDocument()
    })

    it('renders cancel and save buttons', () => {
      renderWithConfig({open: true})
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('renders settings content from config', () => {
      const renderSettingsContent = jest.fn(() => <div data-testid="custom-content">Custom</div>)
      renderWithConfig({open: true}, {renderSettingsContent})
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(renderSettingsContent).toHaveBeenCalled()
    })

    it('disables save button when isSavingSettings is true', () => {
      renderWithConfig({open: true, isSavingSettings: true})
      const saveButton = screen.getByTestId('lmgb-save-settings-button')
      expect(saveButton).toBeDisabled()
    })

    it('does not disable save button when isSavingSettings is false', () => {
      renderWithConfig({open: true, isSavingSettings: false})
      const saveButton = screen.getByTestId('lmgb-save-settings-button')
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('Local Settings Management', () => {
    it('initializes local settings from context when tray opens', () => {
      const {rerender} = renderWithConfig({open: false})

      const config = createConfig()
      rerender(
        <GradebookConfigProvider config={config}>
          <SettingsTray open={true} onDismiss={jest.fn()} />
        </GradebookConfigProvider>
      )

      expect(screen.getByLabelText('Option 1')).toBeChecked()
      expect(screen.getByLabelText('Option 2')).toHaveValue('test')
    })

    it('updates local settings when user makes changes', () => {
      renderWithConfig({open: true})

      const checkbox = screen.getByLabelText('Option 1')
      fireEvent.click(checkbox)

      expect(checkbox).not.toBeChecked()
    })

    it('updates local settings when text input changes', () => {
      renderWithConfig({open: true})

      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      expect(input).toHaveValue('new value')
    })

    it('resets local settings when tray reopens', () => {
      const {rerender} = renderWithConfig({open: true})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'changed'}})
      expect(input).toHaveValue('changed')

      // Close and reopen
      const config = createConfig()
      rerender(
        <GradebookConfigProvider config={config}>
          <SettingsTray open={false} onDismiss={jest.fn()} />
        </GradebookConfigProvider>
      )

      rerender(
        <GradebookConfigProvider config={config}>
          <SettingsTray open={true} onDismiss={jest.fn()} />
        </GradebookConfigProvider>
      )

      // Should be reset to original value
      expect(screen.getByLabelText('Option 2')).toHaveValue('test')
    })
  })

  describe('User Interactions', () => {
    it('calls onDismiss when close button is clicked', () => {
      const onDismiss = jest.fn()
      renderWithConfig({open: true, onDismiss})

      const closeButton = screen.getByRole('button', {name: 'Close Settings Tray'})
      fireEvent.click(closeButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('calls onDismiss and resets form when cancel button is clicked', () => {
      const onDismiss = jest.fn()
      renderWithConfig({open: true, onDismiss})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'changed'}})

      // Click cancel
      fireEvent.click(screen.getByTestId('lmgb-cancel-settings-button'))

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('saves settings successfully when save button is clicked', async () => {
      const onSaveSettings = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: true})
      const setSettings = jest.fn<(settings: TestSettings) => void>()
      const onDismiss = jest.fn()

      renderWithConfig({open: true, onDismiss}, {onSaveSettings, setSettings})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSaveSettings).toHaveBeenCalledWith({
          option1: true,
          option2: 'new value',
        })
      })

      expect(setSettings).toHaveBeenCalledWith({
        option1: true,
        option2: 'new value',
      })
      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Your settings have been saved.',
      })
    })

    it('shows error and resets form when save fails', async () => {
      const onSaveSettings = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: false})
      const setSettings = jest.fn<(settings: TestSettings) => void>()
      const onDismiss = jest.fn()

      renderWithConfig({open: true, onDismiss}, {onSaveSettings, setSettings})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSaveSettings).toHaveBeenCalled()
      })

      expect(setSettings).not.toHaveBeenCalled()
      expect(onDismiss).not.toHaveBeenCalled()
      expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'There was an error saving your settings. Please try again.',
      })

      // Form should be reset to original values
      await waitFor(() => {
        expect(screen.getByLabelText('Option 2')).toHaveValue('test')
      })
    })

    it('shows error when save result is undefined', async () => {
      const onSaveSettings = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult | undefined>>().mockResolvedValue(undefined)
      const setSettings = jest.fn<(settings: TestSettings) => void>()
      const onDismiss = jest.fn()

      renderWithConfig({open: true, onDismiss}, {onSaveSettings, setSettings})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSaveSettings).toHaveBeenCalled()
      })

      expect(setSettings).not.toHaveBeenCalled()
      expect(onDismiss).not.toHaveBeenCalled()
      expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'There was an error saving your settings. Please try again.',
      })
    })

    it('shows error when save result has success: false', async () => {
      const onSaveSettings = jest.fn<(settings: TestSettings) => Promise<SaveSettingsResult>>().mockResolvedValue({success: false, error: 'Server error'})
      const onDismiss = jest.fn()

      renderWithConfig({open: true, onDismiss}, {onSaveSettings})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'There was an error saving your settings. Please try again.',
        })
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles save with unchanged settings', async () => {
      const onSaveSettings = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: true})
      const setSettings = jest.fn<(settings: TestSettings) => void>()
      const onDismiss = jest.fn()

      renderWithConfig({open: true, onDismiss}, {onSaveSettings, setSettings})

      // Don't make any changes, just click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSaveSettings).toHaveBeenCalledWith(defaultSettings)
      })

      expect(setSettings).toHaveBeenCalledWith(defaultSettings)
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('passes correct props to renderSettingsContent', () => {
      const renderSettingsContent = jest.fn(() => <div>Content</div>)
      renderWithConfig({open: true}, {renderSettingsContent})

      expect(renderSettingsContent).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: defaultSettings,
          onChange: expect.any(Function),
        })
      )
    })
  })
})
