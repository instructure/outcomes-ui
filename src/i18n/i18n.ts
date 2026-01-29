// i18n.ts
// Translation wrapper for format-message with override support

import formatMessage, { type Translations } from 'format-message'
import underscoredCrc32 from 'format-message-generate-id/underscored_crc32'
import { loadDefaultTranslations } from './translationLoader'

const defaultTranslations = loadDefaultTranslations()

/**
 * Utility to merge default and override translations for all languages.
 */
function getMergedTranslations(overrides?: Translations): Translations {
  const merged: Translations = { ...defaultTranslations }

  if (overrides) {
    for (const language in overrides) {
      const langOverrides = overrides[language]

      if (langOverrides && typeof langOverrides === 'object') {
        merged[language] = merged[language]
          ? { ...merged[language], ...langOverrides }
          : langOverrides
      }
    }
  }

  return merged
}

/**
 * Get list of available languages.
 */
export function getAvailableLanguages(): string[] {
  return Object.keys(defaultTranslations)
}

/**
 * Check if a language is available.
 */
export function isLanguageAvailable(language: string): boolean {
  return language in defaultTranslations
}

/**
 * Setup format-message for a given language and resource overrides.
 *
 * @param language - The current language code (e.g., 'en', 'es')
 * @param overrides - Optional resource overrides for any language (nested structure: { lang: { key: "text" } })
 * @throws {Error} If the language is not available and no overrides are provided
 */
export function setupI18n(language: string, overrides?: Translations): void {
  if (!isLanguageAvailable(language) && !overrides?.[language]) {
    console.warn(`Language "${language}" not available. Available: ${getAvailableLanguages().join(', ')}`)
  }

  const translations = getMergedTranslations(overrides)

  formatMessage.setup({
    locale: language,
    translations,
    generateId: underscoredCrc32,
  })
}
