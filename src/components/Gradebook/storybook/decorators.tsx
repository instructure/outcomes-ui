import React from 'react'
import { action } from '@storybook/addon-actions'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { NameDisplayFormatSelector } from '@/components/Gradebook/toolbar/SettingsTray/NameDisplaySelector'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import { GradebookApp } from '../GradebookApp'
import { GradebookAppProvider } from '../context/GradebookAppContext'
import type { MasteryLevelConfig } from '../context/GradebookConfigContext/GradebookConfigContext'
import type { SettingsTrayContentProps } from '../toolbar/SettingsTray'

interface ExampleCustomSettings {
  showStudentNames: boolean
  nameDisplayFormat: NameDisplayFormat
}

interface StoryWrapperProps {
  children: React.ReactNode;
  masteryLevelConfig?: MasteryLevelConfig
}

export const ExampleSettingsTrayContent: React.FC<SettingsTrayContentProps<ExampleCustomSettings>> = ({
  settings,
  onChange,
}) => {
  return (
    <Flex direction="column" gap="large">
      <Checkbox
        label="Show student names"
        checked={settings.showStudentNames}
        onChange={() => {
          action('onChangeShowStudentNames')(!settings.showStudentNames)
          onChange({
            ...settings,
            showStudentNames: !settings.showStudentNames,
          })
        }}
      />
      <NameDisplayFormatSelector
        value={settings.nameDisplayFormat}
        onChange={(nameDisplayFormat) => {
          action('onChangeNameDisplayFormat')(nameDisplayFormat)
          onChange({
            ...settings,
            nameDisplayFormat,
          })
        }}
      />
    </Flex>
  )
}

export const StoryWrapper: React.FC<StoryWrapperProps> =
({ children, masteryLevelConfig }) => {
  return (
    <GradebookApp
      config={{
        masteryLevelConfig,
      }}
    >
      <GradebookAppProvider
        settings={{
          settings: {
            showStudentNames: true,
            nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
          },
          onSave: async (settings) => {
            action('onSave')(settings)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Simulate success
            return { success: true }
          },
        }}
      >
        {children}
      </GradebookAppProvider>
    </GradebookApp>
  )
}
