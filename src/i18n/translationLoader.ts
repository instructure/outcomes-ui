import { type Translations } from 'format-message'

/**
 * Load translation files using webpack's require.context.
 */
export function loadTranslationContext() {
  return require.context('../../translations', false, /\.json$/)
}

/**
 * Load and build the default translations object from all translation files.
 */
export function loadDefaultTranslations(): Readonly<Translations> {
  const translationContext = loadTranslationContext()

  return Object.freeze(
    translationContext.keys().reduce((acc, fileName) => {
      const languageCode = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
      return { ...acc, [languageCode]: translationContext(fileName) }
    }, {} as Translations)
  )
}
