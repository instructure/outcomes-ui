import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import MessageStudentsWhoDialog from '..'
import type {Props} from '..'
import type {Student, ObserverUser} from '../types'

jest.mock('format-message', () => (msg: string) => msg)

jest.mock('@instructure/ui-tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockSelection = {
  removeAllRanges: () => {},
  addRange: () => {},
  getRangeAt: () => null,
  setBaseAndExtent: () => {},
  rangeCount: 0,
  focusNode: null,
  isCollapsed: true,
  toString: () => '',
}

beforeAll(() => {
  window.getSelection = () => mockSelection as unknown as Selection
  Document.prototype.getSelection = () => mockSelection as unknown as Selection
  document.createRange = () =>
    ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {nodeName: 'BODY', ownerDocument: document},
      getBoundingClientRect: () => ({top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0}),
      getClientRects: () => [],
      collapse: () => {},
      cloneRange: () => document.createRange(),
    } as unknown as Range)
})

const makeStudent = (id: string, name: string): Student => ({
  id,
  name,
  sortableName: name,
  submittedAt: null,
  workflowState: 'graded',
})

const students: Student[] = [
  makeStudent('1', 'Alice'),
  makeStudent('2', 'Bob'),
  makeStudent('3', 'Carol'),
]

const observersByStudentID: Record<string, ObserverUser[]> = {
  '1': [{id: 'obs-1', name: 'Alice Parent', sortableName: 'Parent, Alice'}],
  '2': [
    {id: 'obs-2', name: 'Bob Guardian', sortableName: 'Guardian, Bob'},
    {id: 'obs-3', name: 'Bob Guardian 2', sortableName: 'Guardian 2, Bob'},
  ],
}

const defaultProps: Props = {
  students,
  onClose: jest.fn(),
  onSend: jest.fn(),
}

const renderDialog = (props: Partial<Props> = {}) => {
  const user = userEvent.setup()
  render(<MessageStudentsWhoDialog {...defaultProps} {...props} />)
  return {user}
}

const studentCheckbox = () => screen.getByTestId('total-student-checkbox') as HTMLInputElement
const observerCheckbox = () => screen.getByTestId('total-observer-checkbox') as HTMLInputElement
const messageInput = () => screen.getByTestId('message-input')
const subjectInput = () => screen.getByTestId('subject-input')

// userEvent.type() causes infinite recursion with InstUI TextArea/TextInput on jsdom 15
// (bundled by jest-environment-jsdom 25.x). Use fireEvent.change as a workaround.
const fillInput = (element: HTMLElement, value: string) => {
  fireEvent.change(element, {target: {value}})
}

describe('MessageStudentsWhoDialog', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('Send validation', () => {
    it('does not call onSend and shows message error when message is empty', async () => {
      const {user} = renderDialog()
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).not.toHaveBeenCalled()
      expect(screen.getByText('A message is required to send this message.')).toBeInTheDocument()
    })

    it('does not call onSend and shows recipient error when all students are deselected', async () => {
      const {user} = renderDialog()
      await user.click(studentCheckbox())
      fillInput(messageInput(), 'Hello')
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).not.toHaveBeenCalled()
      expect(screen.getByText('Please select at least one recipient.')).toBeInTheDocument()
    })

    it('shows both errors when message is empty and no recipients are selected', async () => {
      const {user} = renderDialog()
      await user.click(studentCheckbox())
      await user.click(screen.getByTestId('send-message-button'))
      expect(screen.getByText('Please select at least one recipient.')).toBeInTheDocument()
      expect(screen.getByText('A message is required to send this message.')).toBeInTheDocument()
    })
  })

  describe('Sending', () => {
    it('calls onSend with all student IDs and message body', async () => {
      const {user} = renderDialog()
      fillInput(messageInput(), 'Please review your work.')
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientsIds: expect.arrayContaining(['1', '2', '3']),
          body: 'Please review your work.',
        }),
      )
    })

    it('includes subject in onSend args', async () => {
      const {user} = renderDialog()
      fillInput(subjectInput(), 'Feedback')
      fillInput(messageInput(), 'Great job!')
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).toHaveBeenCalledWith(
        expect.objectContaining({subject: 'Feedback'}),
      )
    })

    it('sends empty string for subject when not filled in', async () => {
      const {user} = renderDialog()
      fillInput(messageInput(), 'Hello')
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).toHaveBeenCalledWith(
        expect.objectContaining({subject: ''}),
      )
    })

    it('includes attachment IDs when attachments are provided', async () => {
      const {user} = renderDialog({
        onAddAttachment: jest.fn(),
        onDeleteAttachment: jest.fn(),
        attachments: [
          {id: 'att-1', display_name: 'file.pdf', mime_class: 'pdf'},
          {id: 'att-2', display_name: 'notes.docx', mime_class: 'doc'},
        ],
      })
      fillInput(messageInput(), 'See attached.')
      await user.click(screen.getByTestId('send-message-button'))
      expect(defaultProps.onSend).toHaveBeenCalledWith(
        expect.objectContaining({attachmentIds: ['att-1', 'att-2']}),
      )
    })

    it('deduplicates recipient IDs if observers overlap with students', async () => {
      const {user} = renderDialog({
        observersByStudentID: {'1': [{id: '1', name: 'Parent', sortableName: 'Parent'}]},
      })
      await user.click(observerCheckbox())
      fillInput(messageInput(), 'Hello')
      await user.click(screen.getByTestId('send-message-button'))
      const call = (defaultProps.onSend as jest.Mock).mock.calls[0][0]
      const ids: string[] = call.recipientsIds
      expect(ids.length).toBe(new Set(ids).size)
    })
  })

  describe('Student checkbox', () => {
    it('starts with all students selected', () => {
      renderDialog()
      expect(studentCheckbox().checked).toBe(true)
      expect(studentCheckbox().indeterminate).toBe(false)
    })

    it('deselects all students when unchecked', async () => {
      const {user} = renderDialog()
      await user.click(studentCheckbox())
      expect(studentCheckbox().checked).toBe(false)
    })

    it('becomes indeterminate after one student is deselected via the table', async () => {
      const {user} = renderDialog()
      await user.click(screen.getByTestId('show_all_recipients'))
      await user.click(screen.getByText('Alice'))
      expect(studentCheckbox().indeterminate).toBe(true)
    })

    it('is disabled when there are no students', () => {
      renderDialog({students: []})
      expect(studentCheckbox().disabled).toBe(true)
    })
  })

  describe('Observer checkbox', () => {
    it('is disabled when no observers are provided', () => {
      renderDialog()
      expect(observerCheckbox().disabled).toBe(true)
    })

    it('is enabled when observers are provided', () => {
      renderDialog({observersByStudentID})
      expect(observerCheckbox().disabled).toBe(false)
    })

    it('checking includes all observer IDs in the send call', async () => {
      const {user} = renderDialog({observersByStudentID})
      await user.click(observerCheckbox())
      fillInput(messageInput(), 'Hello observers')
      await user.click(screen.getByTestId('send-message-button'))
      const call = (defaultProps.onSend as jest.Mock).mock.calls[0][0]
      expect(call.recipientsIds).toContain('obs-1')
      expect(call.recipientsIds).toContain('obs-2')
      expect(call.recipientsIds).toContain('obs-3')
    })

    it('unchecking removes all observers from recipients', async () => {
      const {user} = renderDialog({observersByStudentID})
      await user.click(observerCheckbox())
      await user.click(observerCheckbox())
      fillInput(messageInput(), 'Students only')
      await user.click(screen.getByTestId('send-message-button'))
      const call = (defaultProps.onSend as jest.Mock).mock.calls[0][0]
      expect(call.recipientsIds).not.toContain('obs-1')
    })
  })

  describe('Recipients table', () => {
    it('is hidden by default', () => {
      renderDialog()
      expect(screen.queryByText('Students')).not.toBeInTheDocument()
    })

    it('shows when "Show all recipients" is clicked', async () => {
      const {user} = renderDialog()
      await user.click(screen.getByTestId('show_all_recipients'))
      expect(screen.getByText('Students')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    it('hides again when clicked a second time', async () => {
      const {user} = renderDialog()
      await user.click(screen.getByTestId('show_all_recipients'))
      await user.click(screen.getByTestId('show_all_recipients'))
      expect(screen.queryByText('Students')).not.toBeInTheDocument()
    })

    it('shows observer pills in the table when observers are provided', async () => {
      const {user} = renderDialog({observersByStudentID})
      await user.click(screen.getByTestId('show_all_recipients'))
      expect(screen.getByText('Alice Parent')).toBeInTheDocument()
      expect(screen.getByText('Bob Guardian')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows a spinner when isLoadingObservers is true', () => {
      renderDialog({isLoadingObservers: true})
      expect(screen.getByTitle('Loading')).toBeInTheDocument()
    })

    it('hides the form while observers are loading', () => {
      renderDialog({isLoadingObservers: true})
      expect(screen.queryByRole('textbox', {name: 'Message'})).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox', {name: 'Subject'})).not.toBeInTheDocument()
    })
  })

  describe('File attachment button', () => {
    it('is not rendered when onAddAttachment is not provided', () => {
      renderDialog()
      expect(screen.queryByTestId('attachment-upload')).not.toBeInTheDocument()
    })

    it('is rendered when onAddAttachment is provided', () => {
      renderDialog({onAddAttachment: jest.fn(), onDeleteAttachment: jest.fn()})
      expect(screen.getByTestId('attachment-upload')).toBeInTheDocument()
    })
  })

  describe('Media recording button', () => {
    it('is not rendered when userId is not provided', () => {
      renderDialog()
      expect(screen.queryByTestId('media-upload')).not.toBeInTheDocument()
    })

    it('is rendered when userId is provided', () => {
      renderDialog({userId: 'user-123'})
      expect(screen.getByTestId('media-upload')).toBeInTheDocument()
    })

    it('is enabled by default before any recording is attached', () => {
      renderDialog({userId: 'user-123'})
      expect(screen.getByTestId('media-upload')).not.toBeDisabled()
    })
  })
})
