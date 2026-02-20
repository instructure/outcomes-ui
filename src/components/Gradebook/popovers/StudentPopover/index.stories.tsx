import React from 'react'
import { action } from '@storybook/addon-actions'
import { within, userEvent } from '@storybook/testing-library'
import type { Meta, StoryObj } from '@storybook/react'
import type { LmgbUserDetails, Student, StudentMasteryScores } from '@/types/gradebook'
import { View } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Button } from '@instructure/ui-buttons'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'
import {
  createStudent,
  mockStudent,
  mockStudentLongName,
  mockMasteryScores,
  highMasteryScores,
  lowMasteryScores,
  unassessedMasteryScores,
  mockUserDetailsDefault,
  mockUserDetailsSingleSection,
  mockUserDetailsManySections,
  mockUserDetailsLongCourseName,
  mockUserDetailsNoSections,
} from '@/components/Gradebook/__mocks__/mockData'
import { StudentPopover } from '.'
import type { StudentPopoverProps } from '.'

// Storybook's args type (Partial<Props>) doesn't handle discriminated
// unions in StudentPopoverProps so define a flatten version of it
type StoryArgs = {
  studentName: string
  student?: Student
  userDetails?: LmgbUserDetails
  masteryScores?: StudentMasteryScores
  studentGradesUrl?: string
  headerOverride?: React.ReactNode
  masteryScoresOverride?: React.ReactNode
  actionsOverride?: React.ReactNode
  isLoading?: boolean
  error?: string | null
  onShowingContentChange?: (isShowing: boolean) => void
}

const meta: Meta<StoryArgs> = {
  title: 'Gradebook/StudentPopover',
  component: StudentPopover as React.ComponentType<StoryArgs>,
  args: {
    onShowingContentChange: action('onShowingContentChange'),
  },
  decorators: [
    (Story) => {
      return (
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      )
    }
  ],
}

export default meta
type Story = StoryObj<StoryArgs>

const createStoryArgs = (
  student: Student,
  masteryScores = mockMasteryScores,
): StoryArgs => ({
  student,
  studentName: student.display_name,
  userDetails: mockUserDetailsDefault,
  masteryScores,
  studentGradesUrl: `/courses/123/grades/${student.id}`,
})

const openPopover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const trigger = await canvas.findByTestId('student-cell-link')
  await userEvent.click(trigger)
}

export const Default: Story = {
  args: createStoryArgs(mockStudent),
  play: openPopover,
}

export const HighPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, highMasteryScores),
  play: openPopover,
}

export const LowPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, lowMasteryScores),
  play: openPopover,
}

export const NoScores: Story = {
  args: createStoryArgs(mockStudent, unassessedMasteryScores),
  play: openPopover,
}

export const LongStudentName: Story = {
  args: createStoryArgs(mockStudentLongName),
  play: openPopover,
}

export const LongCourseName: Story = {
  args: {
    ...createStoryArgs(createStudent('4', 'Oliver', 'Brown')),
    userDetails: mockUserDetailsLongCourseName,
  },
  play: openPopover,
}

export const ManySections: Story = {
  args: {
    ...createStoryArgs(createStudent('3', 'Emma', 'Wilson')),
    userDetails: mockUserDetailsManySections,
  },
  play: openPopover,
}

export const NoSections: Story = {
  args: {
    ...createStoryArgs(createStudent('6', 'Liam', 'Miller')),
    userDetails: mockUserDetailsNoSections,
  },
  play: openPopover,
}

export const SingleSection: Story = {
  args: {
    ...createStoryArgs(createStudent('2', 'Jane', 'Doe')),
    userDetails: mockUserDetailsSingleSection,
  },
  play: openPopover,
}

export const CustomHeader: Story = {
  args: createStoryArgs(mockStudent),
  render: (args: StoryArgs) => (
    <StudentPopover
      {...args as StudentPopoverProps}
      student={undefined}
      studentName="John Doe"
      userDetails={undefined}
      headerOverride={
        <Flex padding="0 0 medium 0">
          <Flex.Item>
            <Text>Custom Header for {args.studentName}</Text>
          </Flex.Item>
        </Flex>
      }
    />
  ),
  play: openPopover,
}

export const CustomMasteryScores: Story = {
  args: createStoryArgs(mockStudent),
  render: (args: StoryArgs) => (
    <StudentPopover
      {...args as StudentPopoverProps}
      masteryScores={undefined}
      masteryScoresOverride={
        <View display="block" margin="small">
          <View as="div" padding="x-small 0">
            <Text>Custom Mastery Scores</Text>
          </View>

          <View as="div" padding="x-small 0">
            <Text>Average: {args.masteryScores?.averageText || 'N/A'}</Text>
          </View>

          <View as="div" padding="x-small 0">
            <Text>Total outcomes: 5</Text>
          </View>
        </View>
      }
    />
  ),
  play: openPopover,
}

export const CustomActions: Story = {
  args: createStoryArgs(mockStudent),
  render: (args: StoryArgs) => (
    <StudentPopover
      {...args as StudentPopoverProps}
      studentGradesUrl={undefined}
      actionsOverride={
        <Flex direction="row" gap="small">
          <Button>Custom Action for Student</Button>
          <Button>Another Action</Button>
        </Flex>
      }
    />
  ),
  play: openPopover,
}

export const Loading: Story = {
  args: {
    studentName: mockStudent.display_name,
    studentGradesUrl: `/courses/123/grades/${mockStudent.id}`,
    isLoading: true,
  },
  play: openPopover,
}

export const ErrorMessage: Story = {
  args: {
    studentName: mockStudent.display_name,
    studentGradesUrl: `/courses/123/grades/${mockStudent.id}`,
    error: 'Failed to load student details. Please try again.',
  },
  play: openPopover,
}

export const CustomMasteryLevelConfig: Story = {
  args: createStoryArgs(mockStudent),
  decorators: [
    (Story) => (
      <StoryWrapper
        masteryLevelConfig={{
          availableLevels: ['exceeds_mastery', 'mastery', 'unassessed'],
          masteryLevelOverrides: {
            near_mastery: { name: 'NEAR MASTERY OVERRIDE' }
          }
        }}
      >
        <Story />
      </StoryWrapper>
    )
  ],
  play: openPopover,
}
