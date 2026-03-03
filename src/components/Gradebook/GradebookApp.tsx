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

export interface GradebookAppProps {
  config: GradebookConfig
  translations?: TranslationConfig
}

export const GradebookApp: React.FC<PropsWithChildren<GradebookAppProps>> = ({
  config,
  translations = { language: 'en', i18nEnabled: true },
  children,
}) => {
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
      {children || <div>GradebookAppRoot</div>}
    </GradebookConfigProvider>
  )
}
