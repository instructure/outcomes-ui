import React, { PropsWithChildren, useEffect, useState } from 'react'
import { setupI18n } from '../../i18n/i18n'
import { type Translations } from 'format-message'
import { GradebookConfigProvider, type GradebookConfig } from './context/GradebookConfigContext'
import { GradebookAppProvider, type SaveSettingsResult } from './context/GradebookAppContext'

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

export type { SaveSettingsResult }

export interface GradebookAppProps<TSettings = object> {
  config: GradebookConfig<TSettings>
  settings: {
    settings: TSettings
    onSave: (settings: TSettings) => Promise<SaveSettingsResult>
  }
  translations?: TranslationConfig
}

const GradebookApp = <TSettings extends object = object>({
  config,
  settings,
  translations = { language: 'en', i18nEnabled: true },
  children,
}: PropsWithChildren<GradebookAppProps<TSettings>>) => {
  const { language, resourceOverrides, i18nEnabled } = translations
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
    <GradebookConfigProvider config={config}>
      <GradebookAppProvider settings={settings}>
        {children || <div>GradebookAppRoot</div>}
      </GradebookAppProvider>
    </GradebookConfigProvider>
  )
}

export default GradebookApp
