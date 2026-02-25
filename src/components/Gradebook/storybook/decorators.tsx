import React from 'react'
import { action } from '@storybook/addon-actions'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { NameDisplayFormatSelector } from '@/components/Gradebook/toolbar/SettingsTray/NameDisplaySelector'
import { StudentPopover } from '@/components/Gradebook/popovers/StudentPopover'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import { GradebookApp } from '../GradebookApp'
import { createStudent, mockUserDetailsDefault } from '../__mocks__/mockData'
import type {
  GradebookComponents,
  MasteryLevelConfig,
  SettingsTrayContentProps,
  StudentPopoverWrapperProps
} from '../context/GradebookConfigContext/GradebookConfigContext'

interface ExampleCustomSettings {
  showStudentNames: boolean
  nameDisplayFormat: NameDisplayFormat
}

interface StoryWrapperProps {
  children: React.ReactNode;
  masteryLevelConfig?: MasteryLevelConfig
  components?: Partial<GradebookComponents<ExampleCustomSettings>>
}

const StudentPopoverWrapper: React.FC<StudentPopoverWrapperProps> = (props) => {
  return (
    <StudentPopover
      {...props}
      student={props.student || createStudent('1', 'John', 'Doe')}
      studentName={props.studentName || 'John Doe'}
      studentGradesUrl="/test-url"
      userDetails={mockUserDetailsDefault}
    />
  )
}

const ExampleSettingsTrayContent: React.FC<SettingsTrayContentProps<ExampleCustomSettings>> = ({
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
({ children, masteryLevelConfig, components }) => {
  const defaultComponents: GradebookComponents<ExampleCustomSettings> = {
    StudentPopover: StudentPopoverWrapper,
    SettingsTrayContent: ExampleSettingsTrayContent,
  }

  return (
    <GradebookApp
      config={{
        components: {
          ...defaultComponents,
          ...components,
        },
        masteryLevelConfig,
      }}
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
    </GradebookApp>
  )
}
