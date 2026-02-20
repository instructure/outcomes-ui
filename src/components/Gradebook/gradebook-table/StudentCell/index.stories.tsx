import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View } from '@instructure/ui-view'
import { SecondaryInfoDisplay, NameDisplayFormat } from '@/util/gradebook/constants'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'
import { mockMasteryScores, mockStudent, mockStudentLongName } from '@/components/Gradebook/__mocks__/mockData'
import { StudentCell } from '.'
import type { StudentCellProps } from '.'

const meta: Meta<StudentCellProps> = {
  title: 'Gradebook/StudentCell',
  component: StudentCell,
  decorators: [
    (Story) => (
      <View as="div" width="300px" height="48px" display="block">
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      </View>
    ),
  ],
  args: {
    courseId: '123',
    masteryScores: mockMasteryScores,
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
