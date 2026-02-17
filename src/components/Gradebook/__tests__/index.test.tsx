import React from 'react'
import { expect, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/i18n/translationLoader', () => ({
  loadTranslationContext: () => ({
    keys: () => [],
  }),
  loadDefaultTranslations: () => ({}),
}))

jest.mock('@/i18n/i18n')

jest.mock('../context/GradebookConfigContext', () => ({
  GradebookConfigProvider: ({ children, config }: { children: React.ReactNode; config: unknown }) => (
    <div data-testid="gradebook-config-provider" data-config={JSON.stringify(config)}>
      {children}
    </div>
  ),
}))

import GradebookApp from '../index'
import type { GradebookConfig } from '../context/GradebookConfigContext'
import * as i18nModule from '@/i18n/i18n'
const mockSetupI18n = i18nModule.setupI18n as jest.MockedFunction<typeof i18nModule.setupI18n>

describe('GradebookApp', () => {
  const mockConfig: GradebookConfig = {
    components: {
      StudentPopover: () => <div>Student Popover</div>,
    },
    settingsConfig: {
      settings: {},
      setSettings: jest.fn(),
      onSaveSettings: jest.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: true }),
      renderSettingsContent: () => <div>Settings</div>,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Translation Configuration', () => {
    it('renders with default translation config (i18n enabled)', async () => {
      render(<GradebookApp gradebookConfig={mockConfig} />)

      // Should call setupI18n with default language
      expect(mockSetupI18n).toHaveBeenCalledWith('en', undefined)

      // After effect runs, content should be visible
      await waitFor(() => {
        expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
      })
    })

    it('renders with i18n disabled', () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        />
      )

      // Should not call setupI18n
      expect(mockSetupI18n).not.toHaveBeenCalled()

      // Should render immediately without waiting
      expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
    })

    it('renders with custom language', async () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'es', i18nEnabled: true }}
        />
      )

      expect(mockSetupI18n).toHaveBeenCalledWith('es', undefined)

      await waitFor(() => {
        expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
      })
    })

    it('renders with custom language and resource overrides', async () => {
      const resourceOverrides = {
        en: {
          'test.key': 'Test Value'
        }
      }

      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{
            language: 'fr',
            i18nEnabled: true,
            resourceOverrides,
          }}
        />
      )

      expect(mockSetupI18n).toHaveBeenCalledWith('fr', resourceOverrides)

      await waitFor(() => {
        expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
      })
    })
  })

  describe('Children Rendering', () => {
    it('renders custom children when provided', async () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        >
          <div data-testid="custom-content">Custom Content</div>
        </GradebookApp>
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })

    it('renders fallback content when no children provided', () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        />
      )

      expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
    })
  })

  describe('GradebookConfigProvider Integration', () => {
    it('passes gradebookConfig to GradebookConfigProvider', () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        />
      )

      const provider = screen.getByTestId('gradebook-config-provider')
      expect(provider).toBeInTheDocument()

      const configData = provider.getAttribute('data-config')
      expect(configData).toBeTruthy()

      const parsedConfig = JSON.parse(configData!)
      expect(parsedConfig).toMatchObject({
        settingsConfig: expect.any(Object),
      })
    })

    it('wraps children with GradebookConfigProvider', () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        >
          <div data-testid="test-child">Test</div>
        </GradebookApp>
      )

      const provider = screen.getByTestId('gradebook-config-provider')
      const child = screen.getByTestId('test-child')

      expect(provider).toContainElement(child)
    })
  })

  describe('Loading State', () => {
    it('shows content after i18n is ready', async () => {
      render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'en', i18nEnabled: true }}
        >
          <div data-testid="child-content">Child</div>
        </GradebookApp>
      )

      // After effect runs, content should appear
      await waitFor(() => {
        expect(screen.getByTestId('child-content')).toBeInTheDocument()
      })
    })
  })

  describe('Effect Dependencies', () => {
    it('re-runs setupI18n when language changes', async () => {
      const { rerender } = render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'en', i18nEnabled: true }}
        />
      )

      expect(mockSetupI18n).toHaveBeenCalledWith('en', undefined)
      expect(mockSetupI18n).toHaveBeenCalledTimes(1)

      rerender(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'es', i18nEnabled: true }}
        />
      )

      await waitFor(() => {
        expect(mockSetupI18n).toHaveBeenCalledWith('es', undefined)
        expect(mockSetupI18n).toHaveBeenCalledTimes(2)
      })
    })

    it('re-runs setupI18n when resourceOverrides change', async () => {
      const overrides1 = { en: { key1: 'value1' } }
      const overrides2 = { en: { key2: 'value2' } }

      const { rerender } = render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'en', i18nEnabled: true, resourceOverrides: overrides1 }}
        />
      )

      expect(mockSetupI18n).toHaveBeenCalledWith('en', overrides1)

      rerender(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'en', i18nEnabled: true, resourceOverrides: overrides2 }}
        />
      )

      await waitFor(() => {
        expect(mockSetupI18n).toHaveBeenCalledWith('en', overrides2)
        expect(mockSetupI18n).toHaveBeenCalledTimes(2)
      })
    })

    it('does not re-run setupI18n when i18nEnabled changes to false', () => {
      const { rerender } = render(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ language: 'en', i18nEnabled: true }}
        />
      )

      expect(mockSetupI18n).toHaveBeenCalledTimes(1)

      rerender(
        <GradebookApp
          gradebookConfig={mockConfig}
          translationConfig={{ i18nEnabled: false }}
        />
      )

      // setupI18n should only have been called once
      expect(mockSetupI18n).toHaveBeenCalledTimes(1)
    })
  })

  describe('Type Safety', () => {
    it('accepts gradebookConfig with custom settings type', () => {
      interface CustomSettings {
        customOption: boolean
      }

      const customConfig: GradebookConfig<CustomSettings> = {
        components: {
          StudentPopover: () => <div>Popover</div>,
        },
        settingsConfig: {
          settings: { customOption: true },
          setSettings: jest.fn(),
          onSaveSettings: jest.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: true }),
          renderSettingsContent: () => <div>Settings</div>,
        },
      }

      render(
        <GradebookApp<CustomSettings>
          gradebookConfig={customConfig}
          translationConfig={{ i18nEnabled: false }}
        />
      )

      expect(screen.getByText('GradebookAppRoot')).toBeInTheDocument()
    })
  })
})
