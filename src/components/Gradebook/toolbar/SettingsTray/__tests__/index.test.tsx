import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {SettingsTray} from '../index'
import {
  GradebookConfigProvider,
} from '@/components/Gradebook/context/GradebookConfigContext'
import {
  GradebookAppProvider,
  SaveSettingsResult,
} from '@/components/Gradebook/context/GradebookAppContext'
import {
  GradebookConfig,
  SettingsTrayContentProps,
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

  const mockShowFlashAlert = FlashAlert.showFlashAlert as jest.MockedFunction<typeof FlashAlert.showFlashAlert>
  const defaultMockOnSave = jest
    .fn<(s: TestSettings) => Promise<SaveSettingsResult>>()
    .mockResolvedValue({ success: true })

  const MockSettingsTrayContent: React.FC<SettingsTrayContentProps<TestSettings>> = ({settings, onChange}) => (
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
  )

  const createConfig = (overrides = {}): GradebookConfig<TestSettings> => ({
    components: {
      StudentPopover: () => null,
      SettingsTrayContent: MockSettingsTrayContent,
      ...overrides,
    },
  })

  const renderWithProviders = (
    props = {},
    configOverrides = {},
    settingsOverrides: Partial<{
      settings: TestSettings
      onSave: (s: TestSettings) => Promise<SaveSettingsResult>
    }> = {}
  ) => {
    const config = createConfig(configOverrides)
    const settingsConfig = {
      settings: defaultSettings,
      onSave: defaultMockOnSave,
      ...settingsOverrides,
    }
    return render(
      <GradebookConfigProvider config={config}>
        <GradebookAppProvider settings={settingsConfig}>
          <SettingsTray open={false} onDismiss={jest.fn()} {...props} />
        </GradebookAppProvider>
      </GradebookConfigProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the tray when open', () => {
      renderWithProviders({open: true})
      expect(screen.getByTestId('lmgb-settings-tray')).toBeInTheDocument()
    })

    it('renders the settings header', () => {
      renderWithProviders({open: true})
      expect(screen.getByTestId('lmgb-settings-header')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('renders the close button', () => {
      renderWithProviders({open: true})
      expect(screen.getByTestId('lmgb-close-settings-button')).toBeInTheDocument()
    })

    it('renders cancel and save buttons', () => {
      renderWithProviders({open: true})
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('renders SettingsTrayContent from config', () => {
      const CustomSettingsTrayContent: React.FC<SettingsTrayContentProps<TestSettings>> = () => (
        <div data-testid="custom-content">Custom</div>
      )
      renderWithProviders({open: true}, {SettingsTrayContent: CustomSettingsTrayContent})
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })
  })

  describe('Local Settings Management', () => {
    it('initializes local settings from context when tray opens', () => {
      const {rerender} = renderWithProviders({open: false})

      const config = createConfig()
      const settingsConfig = {
        settings: defaultSettings,
        onSave: defaultMockOnSave,
      }
      rerender(
        <GradebookConfigProvider config={config}>
          <GradebookAppProvider settings={settingsConfig}>
            <SettingsTray open={true} onDismiss={jest.fn()} />
          </GradebookAppProvider>
        </GradebookConfigProvider>
      )

      expect(screen.getByLabelText('Option 1')).toBeChecked()
      expect(screen.getByLabelText('Option 2')).toHaveValue('test')
    })

    it('updates local settings when user makes changes', () => {
      renderWithProviders({open: true})

      const checkbox = screen.getByLabelText('Option 1')
      fireEvent.click(checkbox)

      expect(checkbox).not.toBeChecked()
    })

    it('updates local settings when text input changes', () => {
      renderWithProviders({open: true})

      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      expect(input).toHaveValue('new value')
    })

    it('resets local settings when tray reopens', () => {
      const {rerender} = renderWithProviders({open: true})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'changed'}})
      expect(input).toHaveValue('changed')

      // Close and reopen
      const config = createConfig()
      const settingsConfig = {
        settings: defaultSettings,
        onSave: defaultMockOnSave,
      }
      rerender(
        <GradebookConfigProvider config={config}>
          <GradebookAppProvider settings={settingsConfig}>
            <SettingsTray open={false} onDismiss={jest.fn()} />
          </GradebookAppProvider>
        </GradebookConfigProvider>
      )

      rerender(
        <GradebookConfigProvider config={config}>
          <GradebookAppProvider settings={settingsConfig}>
            <SettingsTray open={true} onDismiss={jest.fn()} />
          </GradebookAppProvider>
        </GradebookConfigProvider>
      )

      // Should be reset to original value
      expect(screen.getByLabelText('Option 2')).toHaveValue('test')
    })
  })

  describe('User Interactions', () => {
    it('calls onDismiss when close button is clicked', () => {
      const onDismiss = jest.fn()
      renderWithProviders({open: true, onDismiss})

      const closeButton = screen.getByRole('button', {name: 'Close Settings Tray'})
      fireEvent.click(closeButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('calls onDismiss and resets form when cancel button is clicked', () => {
      const onDismiss = jest.fn()
      renderWithProviders({open: true, onDismiss})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'changed'}})

      // Click cancel
      fireEvent.click(screen.getByTestId('lmgb-cancel-settings-button'))

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('saves settings successfully when save button is clicked', async () => {
      const onSave = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: true})
      const onDismiss = jest.fn()

      renderWithProviders({open: true, onDismiss}, {}, {onSave})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({
          option1: true,
          option2: 'new value',
        })
      })

      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(mockShowFlashAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Your settings have been saved.',
      })
    })

    it('shows error and keeps tray open when save fails', async () => {
      const onSave = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: false})
      const onDismiss = jest.fn()

      renderWithProviders({open: true, onDismiss}, {}, {onSave})

      // Make a change
      const input = screen.getByLabelText('Option 2')
      fireEvent.change(input, {target: {value: 'new value'}})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled()
      })

      expect(onDismiss).not.toHaveBeenCalled()
      expect(mockShowFlashAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'There was an error saving your settings. Please try again.',
      })

      // Form should keep the changed value
      expect(screen.getByLabelText('Option 2')).toHaveValue('new value')
    })

    it('shows error with custom message when save result has error', async () => {
      const onSave = jest.fn<(settings: TestSettings) => Promise<SaveSettingsResult>>().mockResolvedValue({success: false, error: 'Server error'})
      const onDismiss = jest.fn()

      renderWithProviders({open: true, onDismiss}, {}, {onSave})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(mockShowFlashAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'Server error',
        })
      })

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('shows error when save throws exception', async () => {
      const onSave = jest.fn<(settings: TestSettings) => Promise<SaveSettingsResult>>().mockRejectedValue(new Error('Network error'))
      const onDismiss = jest.fn()

      renderWithProviders({open: true, onDismiss}, {}, {onSave})

      // Click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(mockShowFlashAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'An unexpected error occurred while saving settings',
          err: expect.any(Error),
        })
      })

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('disables save button while saving', async () => {
      const onSave = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockImplementation(() =>
          new Promise(resolve => setTimeout(() => resolve({success: true}), 100)))

      renderWithProviders({open: true}, {}, {onSave})

      const saveButton = screen.getByTestId('lmgb-save-settings-button')
      expect(saveButton).not.toBeDisabled()

      // Click save
      fireEvent.click(saveButton)

      // Should be disabled during save
      expect(saveButton).toBeDisabled()
      expect(saveButton).toHaveTextContent('Saving')

      // Wait for save to complete
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles save with unchanged settings', async () => {
      const onSave = jest.fn<(settings: TestSettings) =>
        Promise<SaveSettingsResult>>().mockResolvedValue({success: true})
      const onDismiss = jest.fn()

      renderWithProviders({open: true, onDismiss}, {}, {onSave})

      // Don't make any changes, just click save
      fireEvent.click(screen.getByTestId('lmgb-save-settings-button'))

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(defaultSettings)
      })

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('passes correct props to SettingsTrayContent', () => {
      const SettingsTrayContent = jest.fn<React.FC<SettingsTrayContentProps<TestSettings>>>(() => <div>Content</div>)
      renderWithProviders({open: true}, {SettingsTrayContent})

      expect(SettingsTrayContent).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: defaultSettings,
          onChange: expect.any(Function),
        }),
        expect.anything()
      )
    })
  })
})
