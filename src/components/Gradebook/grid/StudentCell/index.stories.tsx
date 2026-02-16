import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SecondaryInfoDisplay, NameDisplayFormat } from '@/util/gradebook/constants'
import { StoryWrapper } from '../../storybook/decorators'
import { StudentCell } from '.'
import type { StudentCellProps } from '.'
import { studentPopoverHandlers } from '../../__mocks__/handlers'
import { mockStudent, mockStudentLongName } from '../../__mocks__/mockData'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

const meta: Meta<StudentCellProps> = {
  title: 'Gradebook/StudentCell',
  component: StudentCell,
  parameters: {
    msw: {
      handlers: studentPopoverHandlers,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ width: '300px', height: '48px' }}>
          <StoryWrapper resources={{
            apiHandlers: {
              userDetailsQuery: async (courseId: string, studentId: string) => {
                const response = await fetch(`/api/courses/${courseId}/students/${studentId}/details`)
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`)
                }
                return await response.json()
              },
            },
          }}>
            <Story />
          </StoryWrapper>
        </div>
      </QueryClientProvider>
    ),
  ],
  args: {
    courseId: '123',
  },
}

export default meta
type Story = StoryObj<StudentCellProps>

export const Default: Story = {
  args: {
    student: mockStudent,
  },
}

export const WithSISID: Story = {
  args: {
    student: mockStudent,
    secondaryInfoDisplay: SecondaryInfoDisplay.SIS_ID,
  },
}

export const WithLoginID: Story = {
  args: {
    student: mockStudent,
    secondaryInfoDisplay: SecondaryInfoDisplay.LOGIN_ID,
  },
}

export const WithIntegrationID: Story = {
  args: {
    student: mockStudent,
    secondaryInfoDisplay: SecondaryInfoDisplay.INTEGRATION_ID,
  },
}

export const LastFirstFormat: Story = {
  args: {
    student: mockStudent,
    nameDisplayFormat: NameDisplayFormat.LAST_FIRST,
    secondaryInfoDisplay: SecondaryInfoDisplay.SIS_ID,
  },
}

export const FirstLastFormat: Story = {
  args: {
    student: mockStudent,
    nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
    secondaryInfoDisplay: SecondaryInfoDisplay.LOGIN_ID,
  },
}

export const LongName: Story = {
  args: {
    student: mockStudentLongName,
    secondaryInfoDisplay: SecondaryInfoDisplay.SIS_ID,
  },
}

export const LongNameLastFirst: Story = {
  args: {
    student: mockStudentLongName,
    nameDisplayFormat: NameDisplayFormat.LAST_FIRST,
    secondaryInfoDisplay: SecondaryInfoDisplay.SIS_ID,
  },
}

export const ShowStatus: Story = {
  args: {
    student: {
      ...mockStudent,
      status: 'inactive',
    },
  },
}
