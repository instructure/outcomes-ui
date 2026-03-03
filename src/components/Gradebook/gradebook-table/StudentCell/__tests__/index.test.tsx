import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SecondaryInfoDisplay, NameDisplayFormat } from '@/util/gradebook/constants'
import { Student } from '@/types/gradebook'
import { StudentCell, StudentCellProps } from '../index'

const mockStudent: Student = {
  id: '123',
  name: 'Jane Doe',
  display_name: 'Jane Doe',
  sortable_name: 'Doe, Jane',
  sis_id: 'SIS123',
  integration_id: 'INT456',
  login_id: 'jane.doe@example.com',
  avatar_url: 'https://example.com/avatar.jpg',
  status: 'active',
}

describe('StudentCell', () => {
  const defaultProps: StudentCellProps = {
    student: mockStudent,
    studentPopover: <div data-testid="student-popover">Jane Doe</div>,
  }

  describe('rendering', () => {
    it('renders the student cell with default props', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-cell')).toBeInTheDocument()
    })

    it('renders the student avatar by default', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-avatar')).toBeInTheDocument()
    })

    it('does not render the student avatar when showStudentAvatar is false', () => {
      render(<StudentCell {...defaultProps} showStudentAvatar={false} />)
      expect(screen.queryByTestId('student-avatar')).not.toBeInTheDocument()
    })

    it('renders the student popover', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-popover')).toBeInTheDocument()
    })
  })

  describe('student popover content', () => {
    it('renders the provided student popover content', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-popover')).toHaveTextContent('Jane Doe')
    })

    it('can render custom popover content', () => {
      render(
        <StudentCell
          {...defaultProps}
          studentPopover={<div data-testid="custom-popover">Custom Content</div>}
        />
      )
      expect(screen.getByTestId('custom-popover')).toHaveTextContent('Custom Content')
    })
  })

  describe('secondary info display', () => {
    it('does not render secondary info when secondaryInfoDisplay is not provided', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.queryByTestId('student-secondary-info')).not.toBeInTheDocument()
    })

    it('renders SIS ID when secondaryInfoDisplay is SIS_ID', () => {
      render(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.SIS_ID} />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('SIS123')
    })

    it('renders integration ID when secondaryInfoDisplay is INTEGRATION_ID', () => {
      render(
        <StudentCell
          {...defaultProps}
          secondaryInfoDisplay={SecondaryInfoDisplay.INTEGRATION_ID}
        />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('INT456')
    })

    it('renders login ID when secondaryInfoDisplay is LOGIN_ID', () => {
      render(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.LOGIN_ID} />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('jane.doe@example.com')
    })

    it('renders empty string when SIS ID is not available', () => {
      const studentWithoutSIS = { ...mockStudent, sis_id: undefined }
      render(
        <StudentCell
          {...defaultProps}
          student={studentWithoutSIS}
          secondaryInfoDisplay={SecondaryInfoDisplay.SIS_ID}
        />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('')
    })

    it('renders empty string when integration ID is not available', () => {
      const studentWithoutIntegrationId = { ...mockStudent, integration_id: undefined }
      render(
        <StudentCell
          {...defaultProps}
          student={studentWithoutIntegrationId}
          secondaryInfoDisplay={SecondaryInfoDisplay.INTEGRATION_ID}
        />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('')
    })

    it('renders empty string when login ID is not available', () => {
      const studentWithoutLoginId = { ...mockStudent, login_id: undefined }
      render(
        <StudentCell
          {...defaultProps}
          student={studentWithoutLoginId}
          secondaryInfoDisplay={SecondaryInfoDisplay.LOGIN_ID}
        />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('')
    })

    it('does not render secondary info when secondaryInfoDisplay is NONE', () => {
      render(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.NONE} />,
      )
      expect(screen.queryByTestId('student-secondary-info')).not.toBeInTheDocument()
    })
  })

  describe('student status', () => {
    it('does not render status badge for active students', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.queryByTestId('student-status')).not.toBeInTheDocument()
    })

    it('renders status badge for inactive students', () => {
      const inactiveStudent = { ...mockStudent, status: 'inactive' }
      render(<StudentCell {...defaultProps} student={inactiveStudent} />)
      const status = screen.getByTestId('student-status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveTextContent('inactive')
    })

    it('renders status badge for concluded students', () => {
      const concludedStudent = { ...mockStudent, status: 'concluded' }
      render(<StudentCell {...defaultProps} student={concludedStudent} />)
      const status = screen.getByTestId('student-status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveTextContent('concluded')
    })
  })

  describe('avatar', () => {
    it('sets avatar name from student name', () => {
      render(<StudentCell {...defaultProps} />)
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('sets avatar src from student avatar_url', () => {
      render(<StudentCell {...defaultProps} />)
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('uses sortable_name for avatar when nameDisplayFormat is LAST_FIRST', () => {
      render(
        <StudentCell {...defaultProps} nameDisplayFormat={NameDisplayFormat.LAST_FIRST} />,
      )
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })
})
