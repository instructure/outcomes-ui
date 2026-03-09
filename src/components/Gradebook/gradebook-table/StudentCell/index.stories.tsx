import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View } from '@instructure/ui-view'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import { mockStudent, mockStudentLongName } from './__mocks__/mockData'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'
import { StudentCell } from '.'
import type { StudentCellProps } from '.'
import { StudentPopover } from '../../popovers/StudentPopover'
import { StudentMasteryScores } from '@/types/gradebook'

interface CreateStudentPopoverProps {
  studentName: string
  avatarUrl?: string
  masteryScores?: StudentMasteryScores
}

const createStudentPopover = ({
  studentName,
  avatarUrl,
  masteryScores
}: CreateStudentPopoverProps) => {
  return (
    <StudentPopover
      studentName={studentName}
      avatarUrl={avatarUrl}
      masteryScores={masteryScores}
      studentGradesUrl="/test-url"
      description="Introduction to Computer Science"
      metadata="Section A, Section B"
    />
  )
}

const meta: Meta<StudentCellProps> = {
  title: 'Gradebook/StudentCell',
  component: StudentCell,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <View as="div" width="300px" height="48px" display="block">
          <Story />
        </View>
      </StoryWrapper>
    ),
  ],
  args: {
    studentPopover: createStudentPopover({
      studentName: mockStudent.displayName,
    }),
  },
}

export default meta
type Story = StoryObj<StudentCellProps>

export const Default: Story = {
  args: {
    student: mockStudent,
  },
}

export const WithSecondaryInfo: Story = {
  args: {
    student: mockStudent,
    secondaryInfo: '12345678',
  },
}

export const LastFirstFormat: Story = {
  args: {
    student: mockStudent,
    nameDisplayFormat: NameDisplayFormat.LAST_FIRST,
    studentPopover: createStudentPopover({
      studentName: mockStudent.sortableName,
      avatarUrl: undefined,
    }),
  },
}

export const FirstLastFormat: Story = {
  args: {
    student: mockStudent,
    nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
  },
}

export const LongName: Story = {
  args: {
    student: mockStudentLongName,
    studentPopover: createStudentPopover({
      studentName: mockStudentLongName.displayName,
      avatarUrl: undefined,
    }),
  },
}

export const LongNameLastFirst: Story = {
  args: {
    student: mockStudentLongName,
    nameDisplayFormat: NameDisplayFormat.LAST_FIRST,
    studentPopover: createStudentPopover({
      studentName: mockStudentLongName.sortableName,
      avatarUrl: undefined,
    }),
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
