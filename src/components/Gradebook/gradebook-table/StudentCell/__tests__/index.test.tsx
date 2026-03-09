import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NameDisplayFormat } from '@/util/gradebook/constants'
import { StudentCell, StudentCellProps, StudentData } from '../index'

const mockStudent: StudentData = {
  id: '123',
  displayName: 'Jane Doe',
  sortableName: 'Doe, Jane',
  avatarUrl: 'https://example.com/avatar.jpg',
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
    it('does not render secondary info when secondaryInfo is not provided', () => {
      render(<StudentCell {...defaultProps} />)
      expect(screen.queryByTestId('student-secondary-info')).not.toBeInTheDocument()
    })

    it('renders secondary info when provided', () => {
      render(<StudentCell {...defaultProps} secondaryInfo="SIS123" />)
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('SIS123')
    })

    it('renders empty string when secondaryInfo is an empty string', () => {
      render(<StudentCell {...defaultProps} secondaryInfo="" />)
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('')
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
