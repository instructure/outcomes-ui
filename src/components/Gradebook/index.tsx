import React, { PropsWithChildren, useEffect, useState } from 'react'
import { setupI18n } from '../../i18n/i18n'
import { type Translations } from 'format-message'
import { GradebookConfigProvider, type GradebookConfig } from './context/GradebookConfigContext'

interface I18nDisabledConfig {
  i18nEnabled: false
  language?: never
  resourceOverrides?: never
}

interface I18nEnabledConfig {
  i18nEnabled?: true
  language: string
  resourceOverrides?: Translations
}

export type TranslationConfig = I18nEnabledConfig | I18nDisabledConfig

export interface GradebookAppProps<TSettings = object> {
  gradebookConfig: GradebookConfig<TSettings>
  translationConfig?: TranslationConfig
}

const GradebookApp = <TSettings extends object = object>({
  gradebookConfig,
  translationConfig = { language: 'en', i18nEnabled: true },
  children,
}: PropsWithChildren<GradebookAppProps<TSettings>>) => {
  const { language, resourceOverrides, i18nEnabled } = translationConfig
  const [ i18nReady, setI18nReady ] = useState(false)

  useEffect(() => {
    if (i18nEnabled) {
      setupI18n(language, resourceOverrides)
      setI18nReady(true)
    }
  }, [language, resourceOverrides, i18nEnabled])

  if (i18nEnabled && !i18nReady) {
    return null
  }

  return (
    <GradebookConfigProvider config={gradebookConfig}>
      {children || <div>GradebookAppRoot</div>}
    </GradebookConfigProvider>
  )
}

export default GradebookApp
