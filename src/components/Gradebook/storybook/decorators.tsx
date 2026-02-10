import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { GradebookConfigProvider } from '@/components/Gradebook/context/GradebookConfigContext'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { NameDisplayFormatSelector } from '@/components/Gradebook/toolbar/SettingsTray/NameDisplaySelector'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import { GradebookApiHandlers, GradebookUrlBuilders, SettingsConfig } from '../context/GradebookConfigContext/GradebookConfigContext'

interface ExampleCustomSettings {
  showStudentNames: boolean
  nameDisplayFormat: NameDisplayFormat
}

interface StoryWrapperProps {
  children: React.ReactNode;
  settingsConfig?: SettingsConfig<ExampleCustomSettings>,
  resources?: {
    urlBuilders?: GradebookUrlBuilders,
    apiHandlers?: GradebookApiHandlers
  }
}

export const StoryWrapper: React.FC<StoryWrapperProps> = ({ children, settingsConfig, resources }) => {
  const [settings, setSettings] = useState<ExampleCustomSettings>({
    showStudentNames: true,
    nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
  })

  const defaultResources = {}

  const defaultSettingsConfig: SettingsConfig<ExampleCustomSettings> = {
    settings,
    setSettings,
    onSaveSettings: async (newSettings: ExampleCustomSettings) => {
      action('onSaveSettings')(newSettings)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {success: true}
    },
    renderSettingsContent: ({settings: localSettings, onChange}) => (
      <Flex direction="column" gap="large">
        <Checkbox
          label="Show student names"
          checked={localSettings.showStudentNames}
          onChange={() => {
            action('onChangeShowStudentNames')(!localSettings.showStudentNames)
            onChange({
              ...localSettings,
              showStudentNames: !localSettings.showStudentNames,
            })
          }}
        />
        <NameDisplayFormatSelector
          value={localSettings.nameDisplayFormat}
          onChange={(nameDisplayFormat) => {
            action('onChangeNameDisplayFormat')(nameDisplayFormat)
            onChange({
              ...localSettings,
              nameDisplayFormat,
            })
          }}
        />
      </Flex>
    ),
  }

  return (
    <GradebookConfigProvider<ExampleCustomSettings>
      config={{
        settingsConfig: {
          ...defaultSettingsConfig,
          ...settingsConfig,
        },
        resources: {
          ...defaultResources,
          ...resources,
        }
      }}
    >
      {children}
    </GradebookConfigProvider>
  )
}
