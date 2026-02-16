import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { GradebookConfigProvider } from '@/components/Gradebook/context/GradebookConfigContext'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { NameDisplayFormatSelector } from '@/components/Gradebook/toolbar/SettingsTray/NameDisplaySelector'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import type { GradebookComponents, MasteryLevelConfig, SettingsConfig, StudentPopoverWrapperProps } from '../context/GradebookConfigContext/GradebookConfigContext'
import { StudentPopover } from '@/components/Gradebook/grid/StudentPopover'

interface ExampleCustomSettings {
  showStudentNames: boolean
  nameDisplayFormat: NameDisplayFormat
}

interface StoryWrapperProps {
  children: React.ReactNode;
  settingsConfig?: SettingsConfig<ExampleCustomSettings>,
  masteryLevelConfig?: MasteryLevelConfig
  components?: GradebookComponents
}

const StudentPopoverWrapper: React.FC<StudentPopoverWrapperProps> = (props) => {
  const userDetailsQuery = async (courseId: string, studentId: string) => {
    const response = await fetch(`/api/courses/${courseId}/students/${studentId}/details`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  return (
    <StudentPopover
      {...props}
      headerConfig={{
        userDetailsQuery,
      }}
      actionConfig={{
        studentGradesUrl: `/courses/${props.courseId}/grades/${props.student.id}`,
      }}
    />
  )
}

export const StoryWrapper: React.FC<StoryWrapperProps> =
({ children, settingsConfig, masteryLevelConfig, components }) => {
  const [settings, setSettings] = useState<ExampleCustomSettings>({
    showStudentNames: true,
    nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
  })

  const defaultComponents: GradebookComponents = {
    StudentPopover: StudentPopoverWrapper,
  }

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
        components: components || defaultComponents,
        masteryLevelConfig,
      }}
    >
      {children}
    </GradebookConfigProvider>
  )
}
