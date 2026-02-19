import React from 'react'
import { within, userEvent } from '@storybook/testing-library'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react'
import type { Student, StudentRollupData } from '@/types/gradebook/rollup'
import { View } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Button } from '@instructure/ui-buttons'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'
import { studentPopoverHandlers } from  '@/components/Gradebook/__mocks__/handlers'
import {
  createStudent,
  createRollups,
  mockStudent,
  mockStudentLongName,
  mockOutcomes,
  mixedPerformanceRollups,
  highPerformanceRollups,
  lowPerformanceRollups,
  nearMasteryRollups,
  mixedPerformanceAverage,
  highPerformanceAverage,
  lowPerformanceAverage,
  nearMasteryAverage,
} from '@/components/Gradebook/__mocks__/mockData'
import { StudentPopover } from '.'
import type { StudentPopoverProps } from '.'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

const meta: Meta<StudentPopoverProps> = {
  title: 'Gradebook/StudentPopover',
  component: StudentPopover,
  parameters: {
    msw: {
      handlers: studentPopoverHandlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <StoryWrapper>
            <Story />
          </StoryWrapper>
        </QueryClientProvider>
      )
    }
  ],
}

export default meta
type Story = StoryObj<StudentPopoverProps>

// Shared userDetailsQuery function for all stories
const userDetailsQuery = async (courseId: string, studentId: string) => {
  const response = await fetch(`/api/courses/${courseId}/students/${studentId}/details`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

const createStoryArgs = (
  student: Student,
  rollups: StudentRollupData[],
  outcomes = mockOutcomes
): StudentPopoverProps => ({
  student,
  studentName: student.display_name,
  courseId: '123',
  outcomes,
  rollups,
  headerConfig: {
    userDetailsQuery,
  },
  actionConfig: {
    studentGradesUrl: `/courses/123/grades/${student.id}`,
  },
})

const openPopover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const trigger = await canvas.findByTestId('student-cell-link')
  await userEvent.click(trigger)
}

export const Default: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)),
  play: openPopover,
}

export const HighPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', highPerformanceRollups, highPerformanceAverage.averageMasteryLevel, highPerformanceAverage.averageScore)),
  play: openPopover,
}

export const LowPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', lowPerformanceRollups, lowPerformanceAverage.averageMasteryLevel, lowPerformanceAverage.averageScore)),
  play: openPopover,
}

export const NoScores: Story = {
  args: createStoryArgs(mockStudent, []),
  play: openPopover,
}

export const LongStudentName: Story = {
  args: createStoryArgs(mockStudentLongName, createRollups('2', nearMasteryRollups, nearMasteryAverage.averageMasteryLevel, nearMasteryAverage.averageScore)),
  play: openPopover,
}

export const ManySections: Story = {
  args: createStoryArgs(
    createStudent('3', 'Emma', 'Wilson'),
    createRollups('3', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)
  ),
  play: openPopover,
}

export const LongCourseName: Story = {
  args: createStoryArgs(
    createStudent('4', 'Oliver', 'Brown'),
    createRollups('4', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)
  ),
  play: openPopover,
}

export const NoSections: Story = {
  args: createStoryArgs(
    createStudent('6', 'Liam', 'Miller'),
    createRollups('6', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)
  ),
  play: openPopover,
}

export const ErrorState: Story = {
  args: createStoryArgs(
    createStudent('404', 'John', 'Smith'),
    createRollups('4034', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)
  ),
  play: openPopover,
}

export const CustomHeader: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)),
  render: (args) => (
    <StudentPopover
      {...args}
      headerConfig={{
        ...args.headerConfig,
        renderHeader: (headerProps) => (
          <Flex padding="0 0 medium 0">
            <Flex.Item>
              <Text>
                Custom Header for {headerProps.studentName}
              </Text>
            </Flex.Item>
          </Flex>
        ),
      }}
    />
  ),
  play: openPopover,
}

export const CustomMasteryScores: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', highPerformanceRollups, highPerformanceAverage.averageMasteryLevel, highPerformanceAverage.averageScore)),
  render: (args) => (
    <StudentPopover
      {...args}
      masteryScoresConfig={{
        renderMasteryScores: (masteryScoresProps) => (
          <View display="block" margin="small">
            <View as="div" padding="x-small 0">
              <Text>Custom Mastery Scores</Text>
            </View>

            <View as="div" padding="x-small 0">
              <Text>Average: {masteryScoresProps.masteryScores?.averageText || 'N/A'}</Text>
            </View>

            <View as="div" padding="x-small 0">
              <Text>Total outcomes: {args.rollups?.length || 0}</Text>
            </View>
          </View>
        ),
      }}
    />
  ),
  play: openPopover,
}

export const CustomActions: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)),
  render: (args) => (
    <StudentPopover
      {...args}
      actionConfig={{
        renderActions: () => (
          <Flex direction="row" gap="small">
            <Button>Custom Action for Student</Button>
            <Button>Another Action</Button>
          </Flex>
        ),
      }}
    />
  ),
  play: openPopover,
}

export const CustomMasteryLevelConfig: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore)),
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    )
  ],
  play: openPopover,
}
