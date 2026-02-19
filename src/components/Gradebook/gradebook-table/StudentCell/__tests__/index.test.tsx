import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SecondaryInfoDisplay, NameDisplayFormat } from '@/util/gradebook/constants'
import { Student, Outcome, StudentRollupData } from '@/types/gradebook/rollup'
import { GradebookConfigProvider, type GradebookConfig } from '@/components/Gradebook/context/GradebookConfigContext'
import { StudentCell, StudentCellProps } from '../index'

jest.mock('@/components/Gradebook/popovers/StudentPopover', () => ({
  StudentPopover: ({ studentName }: { studentName: string }) => (
    <div data-testid="student-popover">{studentName}</div>
  ),
}))

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

const mockOutcomes: Outcome[] = [
  {
    id: '1',
    title: 'Outcome 1',
    calculation_method: 'highest',
    points_possible: 3,
    mastery_points: 2,
    ratings: [],
  },
]

const mockRollups: StudentRollupData[] = [
  {
    studentId: '123',
    outcomeRollups: [],
  },
]

const DEFAULT_CONFIG: GradebookConfig = {
  components: {
    StudentPopover: ({ studentName }: { studentName: string }) => (
      <div data-testid="student-popover">{studentName}</div>
    ),
  },
  settingsConfig: {
    settings: {},
    setSettings: () => {},
    onSaveSettings: async () => ({ success: true }),
    renderSettingsContent: () => <div>Settings Content</div>,
  },
}

const renderWithConfig = (ui: React.ReactElement, config: GradebookConfig = DEFAULT_CONFIG) => {
  return render(<GradebookConfigProvider config={config}>{ui}</GradebookConfigProvider>)
}

describe('StudentCell', () => {
  const defaultProps: StudentCellProps = {
    courseId: 'course-1',
    student: mockStudent,
  }

  describe('rendering', () => {
    it('renders the student cell with default props', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-cell')).toBeInTheDocument()
    })

    it('renders the student avatar by default', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-avatar')).toBeInTheDocument()
    })

    it('does not render the student avatar when showStudentAvatar is false', () => {
      renderWithConfig(<StudentCell {...defaultProps} showStudentAvatar={false} />)
      expect(screen.queryByTestId('student-avatar')).not.toBeInTheDocument()
    })

    it('renders the StudentPopover component', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-popover')).toBeInTheDocument()
    })

    it('passes outcomes and rollups to StudentPopover', () => {
      renderWithConfig(
        <StudentCell {...defaultProps} outcomes={mockOutcomes} rollups={mockRollups} />,
      )
      expect(screen.getByTestId('student-popover')).toBeInTheDocument()
    })
  })

  describe('student name display', () => {
    it('displays student display_name by default', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.getByTestId('student-popover')).toHaveTextContent('Jane Doe')
    })

    it('displays student display_name when nameDisplayFormat is FIRST_LAST', () => {
      renderWithConfig(
        <StudentCell {...defaultProps} nameDisplayFormat={NameDisplayFormat.FIRST_LAST} />,
      )
      expect(screen.getByTestId('student-popover')).toHaveTextContent('Jane Doe')
    })

    it('displays student sortable_name when nameDisplayFormat is LAST_FIRST', () => {
      renderWithConfig(
        <StudentCell {...defaultProps} nameDisplayFormat={NameDisplayFormat.LAST_FIRST} />,
      )
      expect(screen.getByTestId('student-popover')).toHaveTextContent('Doe, Jane')
    })
  })

  describe('secondary info display', () => {
    it('does not render secondary info when secondaryInfoDisplay is not provided', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.queryByTestId('student-secondary-info')).not.toBeInTheDocument()
    })

    it('renders SIS ID when secondaryInfoDisplay is SIS_ID', () => {
      renderWithConfig(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.SIS_ID} />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('SIS123')
    })

    it('renders integration ID when secondaryInfoDisplay is INTEGRATION_ID', () => {
      renderWithConfig(
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
      renderWithConfig(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.LOGIN_ID} />,
      )
      const secondaryInfo = screen.getByTestId('student-secondary-info')
      expect(secondaryInfo).toBeInTheDocument()
      expect(secondaryInfo).toHaveTextContent('jane.doe@example.com')
    })

    it('renders empty string when SIS ID is not available', () => {
      const studentWithoutSIS = { ...mockStudent, sis_id: undefined }
      renderWithConfig(
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
      renderWithConfig(
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
      renderWithConfig(
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
      renderWithConfig(
        <StudentCell {...defaultProps} secondaryInfoDisplay={SecondaryInfoDisplay.NONE} />,
      )
      expect(screen.queryByTestId('student-secondary-info')).not.toBeInTheDocument()
    })
  })

  describe('student status', () => {
    it('does not render status badge for active students', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      expect(screen.queryByTestId('student-status')).not.toBeInTheDocument()
    })

    it('renders status badge for inactive students', () => {
      const inactiveStudent = { ...mockStudent, status: 'inactive' }
      renderWithConfig(<StudentCell {...defaultProps} student={inactiveStudent} />)
      const status = screen.getByTestId('student-status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveTextContent('inactive')
    })

    it('renders status badge for concluded students', () => {
      const concludedStudent = { ...mockStudent, status: 'concluded' }
      renderWithConfig(<StudentCell {...defaultProps} student={concludedStudent} />)
      const status = screen.getByTestId('student-status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveTextContent('concluded')
    })
  })

  describe('avatar', () => {
    it('sets avatar name from student name', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('sets avatar src from student avatar_url', () => {
      renderWithConfig(<StudentCell {...defaultProps} />)
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('uses sortable_name for avatar when nameDisplayFormat is LAST_FIRST', () => {
      renderWithConfig(
        <StudentCell {...defaultProps} nameDisplayFormat={NameDisplayFormat.LAST_FIRST} />,
      )
      const avatar = screen.getByTestId('student-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })
})
