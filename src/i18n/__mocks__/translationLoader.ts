import { type Translations } from 'format-message'

/**
 * Mock version that returns minimal test translations.
 */
export function loadDefaultTranslations(): Readonly<Translations> {
  return Object.freeze({
    en: {
      test_key_1: { message: 'Test message 1' },
      test_key_2: { message: 'Test message 2' },
    },
    es: {
      test_key_1: { message: 'Mensaje de prueba 1' },
      test_key_2: { message: 'Mensaje de prueba 2' },
    }
  })
}
