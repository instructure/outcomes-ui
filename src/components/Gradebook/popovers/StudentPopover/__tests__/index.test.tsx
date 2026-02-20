import React from 'react'
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GradebookConfigProvider } from '@/components/Gradebook/context/GradebookConfigContext'
import {
  mockStudent,
  mockStudentLongName,
  mockUserDetailsDefault,
  mockUserDetailsNoSections,
  mockMasteryScores,
} from '@/components/Gradebook/__mocks__/mockData'
import { StudentPopover } from '..'
import type { StudentPopoverProps } from '..'

jest.mock('format-message', () => (msg: string) => msg)

describe('StudentPopover', () => {
  const defaultProps: StudentPopoverProps = {
    student: mockStudent,
    studentName: mockStudent.display_name,
    userDetails: mockUserDetailsDefault,
    masteryScores: mockMasteryScores,
    studentGradesUrl: '/courses/123/grades/1',
  }

  const renderComponent = (props: Partial<StudentPopoverProps> = {}) => {
    return render(
      <GradebookConfigProvider
        config={{
          components: {
            StudentPopover: () => null,
            SettingsTrayContent: () => null,
          },
        }}
      >
        <StudentPopover {...{ ...defaultProps, ...props } as StudentPopoverProps} />
      </GradebookConfigProvider>
    )
  }

  describe('Rendering', () => {
    it('renders the student name as a clickable link', () => {
      renderComponent()
      const link = screen.getByTestId('student-cell-link')
      expect(link).toBeInTheDocument()
      expect(within(link).getByText(mockStudent.display_name)).toBeInTheDocument()
    })

    it('renders long student names with truncation', () => {
      renderComponent({
        student: mockStudentLongName,
        studentName: mockStudentLongName.display_name,
      })
      const link = screen.getByTestId('student-cell-link')
      expect(link).toBeInTheDocument()
    })

    it('does not render popover content initially', () => {
      renderComponent()
      expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
    })

    it('renders custom header when headerOverride is provided', async () => {
      renderComponent({
        headerOverride: <div data-testid="custom-header">Custom Header</div>,
      })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByTestId('custom-header')).toBeInTheDocument()
    })

    it('renders custom mastery scores when masteryScoresOverride is provided', async () => {
      renderComponent({
        masteryScoresOverride: <div data-testid="custom-mastery-scores">Custom Mastery Scores</div>,
      })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByTestId('custom-mastery-scores')).toBeInTheDocument()
    })

    it('renders custom actions when actionsOverride is provided', async () => {
      renderComponent({
        actionsOverride: <div data-testid="custom-actions">Custom Actions</div>,
      })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByTestId('custom-actions')).toBeInTheDocument()
      expect(screen.queryByText('Message')).not.toBeInTheDocument()
    })
  })

  describe('Popover Interaction', () => {
    it('opens and closes popover', async () => {
      renderComponent()

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByTestId('lmgb-student-popover-avatar')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))

      await waitFor(() => {
        expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
      })
    })
  })

  describe('User Details Display', () => {
    it('displays user details including avatar, name, course, and sections', async () => {
      renderComponent()

      fireEvent.click(screen.getByTestId('student-cell-link'))

      await screen.findByTestId('lmgb-student-popover-avatar')
      expect(screen.getAllByText(mockStudent.display_name).length).toBeGreaterThan(0)
      expect(screen.getByText('Introduction to Computer Science')).toBeInTheDocument()
      expect(screen.getByText('Section A, Section B')).toBeInTheDocument()
    })

    it('does not display sections when none exist', async () => {
      renderComponent({ userDetails: mockUserDetailsNoSections })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      await screen.findByTestId('lmgb-student-popover-avatar')

      expect(screen.queryByText(/Section/)).not.toBeInTheDocument()
    })
  })

  describe('Action Links', () => {
    it('displays action links with correct behavior', async () => {
      const gradesUrl = '/courses/123/grades/1'
      renderComponent({ studentGradesUrl: gradesUrl })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      const messageLink = await screen.findByText('Message')
      expect(messageLink).toBeInTheDocument()

      const masteryLink = screen.getByText('View Mastery Report')
      expect(masteryLink.closest('a')).toHaveAttribute('href', gradesUrl)
    })

    it('handles message link click', async () => {
      renderComponent()

      fireEvent.click(screen.getByTestId('student-cell-link'))

      const messageLink = await screen.findByText('Message')

      expect(() => fireEvent.click(messageLink)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('has accessible close button', async () => {
      renderComponent()

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing mastery scores gracefully', async () => {
      renderComponent({ masteryScores: undefined })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      await screen.findByTestId('lmgb-student-popover-avatar')

      expect(screen.getAllByText(mockStudent.display_name).length).toBeGreaterThan(0)
    })
  })

  describe('Loading State', () => {
    it('shows a spinner when isLoading is true', async () => {
      renderComponent({ isLoading: true })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByTitle('Loading user details')).toBeInTheDocument()
    })

    it('does not show student details when isLoading is true', async () => {
      renderComponent({ isLoading: true })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      await screen.findByTitle('Loading user details')

      expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('shows an error message when error prop is provided', async () => {
      renderComponent({ error: 'Failed to load student details' })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      expect(await screen.findByText('Failed to load student details')).toBeInTheDocument()
    })

    it('does not show student details when error is present', async () => {
      renderComponent({ error: 'Something went wrong' })

      fireEvent.click(screen.getByTestId('student-cell-link'))

      await screen.findByText('Something went wrong')

      expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
    })
  })
})
