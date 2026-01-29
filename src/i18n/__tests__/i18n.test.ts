import { expect, jest, describe, it, beforeEach } from '@jest/globals'

// Mock the translation loader
jest.mock('../translationLoader', () => ({
  loadDefaultTranslations: () => ({
    en: {
      test_key_1: { message: 'Test message 1' },
      test_key_2: { message: 'Test message 2' },
    },
    es: {
      test_key_1: { message: 'Mensaje de prueba 1' },
      test_key_2: { message: 'Mensaje de prueba 2' },
    },
  }),
}))

// Mock format-message
jest.mock('format-message')

// Mock format-message-generate-id
jest.mock('format-message-generate-id/underscored_crc32')

// Now import
import formatMessage, { type SetupOptions } from 'format-message'
import { setupI18n, getAvailableLanguages, isLanguageAvailable } from '../i18n'

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mocks
    const mockSetup = jest.fn()
    ;(formatMessage.setup as unknown) = mockSetup
  })

  describe('getAvailableLanguages', () => {
    it('returns list of available languages', () => {
      const languages = getAvailableLanguages()
      expect(Array.isArray(languages)).toBe(true)
      expect(languages.length).toBeGreaterThan(0)
      // Should include at least the languages from the translations folder
      expect(languages).toContain('en')
    })
  })

  describe('isLanguageAvailable', () => {
    it('returns true for available language', () => {
      expect(isLanguageAvailable('en')).toBe(true)
    })

    it('returns false for unavailable language', () => {
      expect(isLanguageAvailable('xyz')).toBe(false)
    })
  })

  describe('setupI18n', () => {
    it('calls formatMessage.setup with correct parameters', () => {
      setupI18n('en')

      expect(formatMessage.setup).toHaveBeenCalledTimes(1)
      const callArgs = (formatMessage.setup as jest.Mock).mock.calls[0][0] as SetupOptions

      expect(callArgs.locale).toBe('en')
      expect(callArgs.translations).toBeDefined()
      expect(callArgs.generateId).toBeDefined()
    })

    it('merges overrides with default translations', () => {
      const overrides = {
        en: {
          custom_key: { message: 'Custom message' },
        },
      }

      setupI18n('en', overrides)

      const callArgs = (formatMessage.setup as jest.Mock).mock.calls[0][0] as SetupOptions
      const translations = callArgs.translations!

      expect(translations.en!.custom_key).toEqual({ message: 'Custom message' })
    })

    it('preserves default translations when overriding', () => {
      const overrides = {
        en: {
          custom_key: { message: 'Custom message' },
        },
      }

      setupI18n('en', overrides)

      const callArgs = (formatMessage.setup as jest.Mock).mock.calls[0][0] as SetupOptions
      const translations = callArgs.translations!

      // Original translations should still be present
      expect(translations.en!.test_key_1).toBeDefined()
      expect(translations.en!.custom_key).toEqual({ message: 'Custom message' })
    })

    it('warns when language is not available and no override provided', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      setupI18n('xyz')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Language "xyz" not available')
      )

      consoleWarnSpy.mockRestore()
    })

    it('does not warn when unavailable language has override', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      setupI18n('xyz', {
        xyz: { key1: { message: 'Test' } },
      })

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('handles empty overrides object', () => {
      setupI18n('en', {})

      expect(formatMessage.setup).toHaveBeenCalledTimes(1)
      const callArgs = (formatMessage.setup as jest.Mock).mock.calls[0][0] as SetupOptions

      expect(callArgs.locale).toBe('en')
      expect(callArgs.translations).toBeDefined()
    })

    it('handles undefined overrides', () => {
      setupI18n('en', undefined)

      expect(formatMessage.setup).toHaveBeenCalledTimes(1)
      const callArgs = (formatMessage.setup as jest.Mock).mock.calls[0][0] as SetupOptions

      expect(callArgs.locale).toBe('en')
      expect(callArgs.translations).toBeDefined()
    })
  })
})
