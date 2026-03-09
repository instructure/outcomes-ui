import React from 'react'
import { action } from '@storybook/addon-actions'
import { within, userEvent } from '@storybook/testing-library'
import type { Meta, StoryObj } from '@storybook/react'
import type { StudentMasteryScores } from '@/types/gradebook'
import type { StudentData } from '@/components/Gradebook/gradebook-table/StudentCell'
import { View } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Button } from '@instructure/ui-buttons'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'
import {
  mockStudent,
  mockStudentLongName,
} from '@/components/Gradebook/gradebook-table/StudentCell/__mocks__/mockData'
import {
  mockMasteryScores,
  highMasteryScores,
  lowMasteryScores,
  unassessedMasteryScores,
  mockCaptionDefault,
} from './__mocks__/mockData'
import { StudentPopover } from '.'
import type { StudentPopoverProps } from '.'

// Storybook's args type (Partial<Props>) doesn't handle discriminated
// unions in StudentPopoverProps so define a flatten version of it
type StoryArgs = {
  studentName: string
  student?: StudentData
  description?: string
  metadata?: string
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
  student: StudentData,
  masteryScores = mockMasteryScores,
): StoryArgs => ({
  student,
  studentName: student.displayName,
  ...mockCaptionDefault,
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

export const WithDescriptionOnly: Story = {
  args: {
    ...createStoryArgs(mockStudent),
    description: 'Introduction to Computer Science',
    metadata: undefined,
  },
  play: openPopover,
}

export const WithLongDescription: Story = {
  args: {
    ...createStoryArgs(mockStudent),
    description: 'Advanced Placement European History: Renaissance to Modern Era',
    metadata: 'AP Section',
  },
  play: openPopover,
}

export const WithLongMetaData: Story = {
  args: {
    ...createStoryArgs(mockStudent),
    description: 'World History',
    metadata: 'Section A - Morning, Section B - Afternoon, Section C - Evening, Section D - Online',
  },
  play: openPopover,
}

export const CustomHeader: Story = {
  args: createStoryArgs(mockStudent),
  render: (args: StoryArgs) => (
    <StudentPopover
      {...args as StudentPopoverProps}
      avatarUrl={undefined}
      studentName="John Doe"
      description={undefined}
      metadata={undefined}
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
    studentName: mockStudent.displayName,
    studentGradesUrl: `/courses/123/grades/${mockStudent.id}`,
    isLoading: true,
  },
  play: openPopover,
}

export const ErrorMessage: Story = {
  args: {
    studentName: mockStudent.displayName,
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
