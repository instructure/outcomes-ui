import React from 'react'
import { within, userEvent } from '@storybook/testing-library'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react'
import type { Student, StudentRollupData } from '@/types/gradebook/rollup'
import { View } from '@instructure/ui-view'
import { StudentPopover } from '.'
import type { StudentPopoverProps } from '.'
import { StoryWrapper } from '../../storybook/decorators'
import { studentPopoverHandlers } from '../../__mocks__/handlers'
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
} from '../../__mocks__/mockData'

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
          <StoryWrapper resources={{
            apiHandlers: {
              userDetailsQuery: async (courseId: string, studentId: string) => {
                const response = await fetch(`/api/courses/${courseId}/students/${studentId}/details`)
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`)
                }
                return await response.json()
              },
            }
          }}>
            <Story />
          </StoryWrapper>
        </QueryClientProvider>
      )
    }
  ],
}

export default meta
type Story = StoryObj<StudentPopoverProps>

const createStoryArgs = (
  student: Student,
  rollups: StudentRollupData[],
  outcomes = mockOutcomes
): StudentPopoverProps => ({
  student,
  studentName: student.display_name,
  studentGradesUrl: `/courses/123/grades/${student.id}`,
  courseId: '123',
  outcomes,
  rollups,
})

const openPopover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const trigger = await canvas.findByTestId('student-cell-link')
  await userEvent.click(trigger)
}

export const Default: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups)),
  play: openPopover,
}

export const HighPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', highPerformanceRollups)),
  play: openPopover,
}

export const LowPerformingStudent: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', lowPerformanceRollups)),
  play: openPopover,
}

export const NoScores: Story = {
  args: createStoryArgs(mockStudent, []),
  play: openPopover,
}

export const LongStudentName: Story = {
  args: createStoryArgs(mockStudentLongName, createRollups('2', nearMasteryRollups)),
  play: openPopover,
}

export const ManySections: Story = {
  args: createStoryArgs(
    createStudent('3', 'Emma', 'Wilson'),
    createRollups('3', mixedPerformanceRollups)
  ),
  play: openPopover,
}

export const LongCourseName: Story = {
  args: createStoryArgs(
    createStudent('4', 'Oliver', 'Brown'),
    createRollups('4', mixedPerformanceRollups)
  ),
  play: openPopover,
}

export const NoSections: Story = {
  args: createStoryArgs(
    createStudent('6', 'Liam', 'Miller'),
    createRollups('6', mixedPerformanceRollups)
  ),
  play: openPopover,
}

export const ErrorState: Story = {
  args: createStoryArgs(
    createStudent('404', 'John', 'Smith'),
    createRollups('4034', mixedPerformanceRollups)
  ),
  play: openPopover,
}

export const CustomHeader: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups)),
  render: (args) => (
    <StudentPopover
      {...args}
      renderHeader={() => (
        <View display="block" margin="small">
          <h3>Custom Header</h3>
          <p>{args.studentName} - {args.student.id}</p>
        </View>
      )}
    />
  ),
  play: openPopover,
}

export const CustomMasteryScores: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', highPerformanceRollups)),
  render: (args) => (
    <StudentPopover
      {...args}
      renderMasteryScores={() => (
        <View display="block" margin="small">
          <strong>Custom Mastery Display</strong>
          <p>Total outcomes: {args.rollups?.length || 0}</p>
        </View>
      )}
    />
  ),
  play: openPopover,
}

export const CustomActions: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups)),
  render: (args) => (
    <StudentPopover
      {...args}
      renderActions={() => (
        <View display="block" margin="small">
          <button>Custom Action 1</button>
          <button>Custom Action 2</button>
        </View>
      )}
    />
  ),
  play: openPopover,
}

export const CustomHeaderWithProps: Story = {
  args: createStoryArgs(mockStudent, createRollups('1', mixedPerformanceRollups)),
  render: (args) => (
    <StudentPopover
      {...args}
      renderHeader={({ studentName, userDetails }) => (
        <div>
          <h3>{studentName}</h3>
          {userDetails && (
            <>
              <p>Course: {userDetails.course.name}</p>
              {userDetails.user.sections.length > 0 && (
                <p>Sections: {userDetails.user.sections.map((s) => s.name).join(', ')}</p>
              )}
            </>
          )}
        </div>
      )}
    />
  ),
  play: openPopover,
}
