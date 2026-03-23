import React from 'react'
import {action} from '@storybook/addon-actions'
import type {Meta, StoryObj} from '@storybook/react'
import {StoryWrapper} from '@/components/Gradebook/storybook/decorators'
import MessageStudentsWhoDialog from '.'
import type {Props} from '.'
import type {Student, ObserverUser} from './types'

const meta: Meta<Props> = {
  title: 'Gradebook/Dialogs/MessageStudentsWhoDialog',
  component: MessageStudentsWhoDialog,
  args: {
    onClose: action('onClose'),
    onSend: action('onSend'),
  },
  decorators: [
    Story => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
}

export default meta
type Story = StoryObj<Props>

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    sortableName: 'Johnson, Alice',
    submittedAt: null,
    workflowState: 'graded',
  },
  {
    id: '2',
    name: 'Bob Martinez',
    sortableName: 'Martinez, Bob',
    submittedAt: new Date('2026-03-01'),
    workflowState: 'graded',
  },
  {
    id: '3',
    name: 'Carol Williams',
    sortableName: 'Williams, Carol',
    submittedAt: null,
    workflowState: 'unsubmitted',
  },
]

const mockObservers: Record<string, ObserverUser[]> = {
  '1': [
    {id: 'obs-1', name: 'Alice Parent', sortableName: 'Parent, Alice'},
  ],
  '2': [
    {id: 'obs-2', name: 'Bob Guardian', sortableName: 'Guardian, Bob'},
    {id: 'obs-3', name: 'Bob Guardian 2', sortableName: 'Guardian 2, Bob'},
  ],
}

export const Default: Story = {
  args: {
    students: mockStudents,
  },
}

export const WithFileAttachments: Story = {
  args: {
    students: mockStudents,
    onAddAttachment: action('onAddAttachment'),
    onDeleteAttachment: action('onDeleteAttachment'),
    attachments: [
      {id: 'att-1', display_name: 'rubric.pdf', mime_class: 'pdf'},
      {id: 'att-2', display_name: 'instructions.docx', mime_class: 'doc'},
    ],
  },
}

export const WithPendingUploads: Story = {
  args: {
    students: mockStudents,
    onAddAttachment: action('onAddAttachment'),
    onDeleteAttachment: action('onDeleteAttachment'),
    attachments: [{id: 'att-1', display_name: 'rubric.pdf', mime_class: 'pdf'}],
    pendingUploads: [{id: 'pending-0-notes.txt', display_name: 'notes.txt', isLoading: true}],
  },
}

export const WithMediaRecording: Story = {
  args: {
    students: mockStudents,
    userId: 'user-123',
  },
}

export const WithObservers: Story = {
  args: {
    students: mockStudents,
    observersByStudentID: mockObservers,
  },
}

export const LoadingObservers: Story = {
  args: {
    students: mockStudents,
    isLoadingObservers: true,
  },
}

export const NoStudents: Story = {
  args: {
    students: [],
  },
}

export const FullyEquipped: Story = {
  args: {
    students: mockStudents,
    observersByStudentID: mockObservers,
    onAddAttachment: action('onAddAttachment'),
    onDeleteAttachment: action('onDeleteAttachment'),
    attachments: [{id: 'att-1', display_name: 'rubric.pdf', mime_class: 'pdf'}],
    userId: 'user-123',
  },
}
