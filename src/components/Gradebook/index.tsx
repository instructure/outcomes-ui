import React, { useEffect, useState } from 'react'
import { setupI18n } from '../../i18n/i18n'
import t from 'format-message'
import { type Translations } from 'format-message'

interface I18nDisabledConfig {
  i18nEnabled: false;
  language?: never;
  resourceOverrides?: never;
}

interface I18nEnabledConfig {
  i18nEnabled?: true;
  language: string;
  resourceOverrides?: Translations;
}

type TranslationConfig = I18nEnabledConfig | I18nDisabledConfig;

export interface GradebookAppProps {
  translationConfig: TranslationConfig;
}

const GradebookApp: React.FC<GradebookAppProps> = ({
  translationConfig = { language: 'en', i18nEnabled: true },
}) => {
  const { language, resourceOverrides, i18nEnabled } = translationConfig
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    if (i18nEnabled) {
      setupI18n(language, resourceOverrides)
      setI18nReady(true)
    }
  }, [language, resourceOverrides, i18nEnabled])

  if (i18nEnabled && !i18nReady) {
    return null
  }

  return <>
    <div>GradebookAppRoot</div>
    <div>{t('Align new outcomes')}</div>
  </>
}

export default GradebookApp
