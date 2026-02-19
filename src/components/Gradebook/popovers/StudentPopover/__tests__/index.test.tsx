import React from 'react'
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GradebookConfigProvider } from '@/components/Gradebook/context/GradebookConfigContext'
import type { LmgbUserDetails } from '@/hooks/gradebook/useLmgbUserDetails'
import {
  mockStudent,
  mockStudentLongName,
  mockOutcomes,
  createRollups,
  mixedPerformanceRollups,
  mixedPerformanceAverage,
  mockUserDetailsDefault,
  mockUserDetailsNoSections,
} from '@/components/Gradebook/__mocks__/mockData'
import { StudentPopover } from '..'
import type { StudentPopoverProps } from '..'

jest.mock('format-message', () => (msg: string) => msg)

describe('StudentPopover', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
  })

  afterEach(() => {
    queryClient?.clear()
    queryClient?.unmount()
  })

  const createMockUserDetailsHandler = (
    mockData: LmgbUserDetails = mockUserDetailsDefault,
    shouldError = false
  ) => {
    return async () => {
      if (shouldError) {
        throw new Error('Failed to fetch user details')
      }
      return mockData
    }
  }

  const defaultProps: StudentPopoverProps = {
    student: mockStudent,
    studentName: mockStudent.display_name,
    courseId: '123',
    outcomes: mockOutcomes,
    rollups: createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore),
    headerConfig: {
      userDetailsQuery: createMockUserDetailsHandler(),
    },
    actionConfig: {
      studentGradesUrl: '/courses/123/grades/1',
    },
  }

  const renderComponent = (
    props: Partial<StudentPopoverProps> = {}
  ) => {
    const mergedProps: StudentPopoverProps = {
      ...defaultProps,
      ...props,
      // Merge headerConfig if provided
      headerConfig: props.headerConfig
        ? { ...defaultProps.headerConfig, ...props.headerConfig }
        : defaultProps.headerConfig,
      // Use actionConfig from props if provided, otherwise use default
      actionConfig: props.actionConfig || defaultProps.actionConfig,
      // Merge masteryScoresConfig if provided
      masteryScoresConfig: props.masteryScoresConfig
        ? { ...defaultProps.masteryScoresConfig, ...props.masteryScoresConfig }
        : defaultProps.masteryScoresConfig,
    }

    return render(
      <QueryClientProvider client={queryClient}>
        <GradebookConfigProvider
          config={{
            components: {
              StudentPopover: () => null,
            },
            settingsConfig: {
              settings: {},
              setSettings: () => {},
              onSaveSettings: async () => ({ success: true }),
              renderSettingsContent: () => null,
            },
          }}
        >
          <StudentPopover {...mergedProps} />
        </GradebookConfigProvider>
      </QueryClientProvider>
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

    it('renders custom components when provided', async () => {
      const customHeader = () => <div data-testid="custom-header">Custom Header</div>

      render(
        <QueryClientProvider client={queryClient}>
          <GradebookConfigProvider
            config={{
              components: {
                StudentPopover: () => null,
              },
              settingsConfig: {
                settings: {},
                setSettings: () => {},
                onSaveSettings: async () => ({ success: true }),
                renderSettingsContent: () => null,
              },
            }}
          >
            <StudentPopover
              {...defaultProps}
              headerConfig={{
                ...defaultProps.headerConfig,
                renderHeader: customHeader,
              }}
            />
          </GradebookConfigProvider>
        </QueryClientProvider>
      )

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('custom-header', {}, { timeout: 200 })
      expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    })
  })

  describe('Popover Interaction', () => {
    it('opens and closes popover', async () => {
      renderComponent()

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      // Should show loading then content
      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })

      // Should close when clicking close button
      const closeButton = screen.getByRole('button', { name: 'Close' })
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
      }, { timeout: 200 })
    })
  })

  describe('User Details Display', () => {
    it('displays user details including avatar, name, course, and sections', async () => {
      renderComponent()

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })
      expect(screen.getAllByText(mockStudent.display_name).length).toBeGreaterThan(0)
      expect(screen.getByText('Introduction to Computer Science')).toBeInTheDocument()
      expect(screen.getByText('Section A, Section B')).toBeInTheDocument()
    })

    it('does not display sections when none exist', async () => {
      renderComponent({
        headerConfig: {
          userDetailsQuery: createMockUserDetailsHandler(mockUserDetailsNoSections),
        },
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })

      expect(screen.queryByText(/Section/)).not.toBeInTheDocument()
    })
  })

  describe('Mastery Scores Display', () => {
    it('displays mastery scores when rollups are provided', async () => {
      renderComponent({
        rollups: createRollups('1', mixedPerformanceRollups, mixedPerformanceAverage.averageMasteryLevel, mixedPerformanceAverage.averageScore),
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })

      // Should display average score
      expect(screen.getByText(/3\.0/)).toBeInTheDocument()
    })

    it('handles no scores gracefully', async () => {
      renderComponent({
        rollups: [],
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })

      // Should not crash and still display user details
      expect(screen.getAllByText(mockStudent.display_name).length).toBeGreaterThan(0)
    })
  })

  describe('Action Links', () => {
    it('displays action links with correct behavior', async () => {
      const gradesUrl = '/courses/123/grades/1'
      renderComponent({
        actionConfig: {
          studentGradesUrl: gradesUrl,
        },
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      // Should display Message link
      const messageLink = await screen.findByText('Message', {}, { timeout: 200 })
      expect(messageLink).toBeInTheDocument()

      // Should display View Mastery Report link with correct href
      const masteryLink = screen.getByText('View Mastery Report')
      expect(masteryLink.closest('a')).toHaveAttribute('href', gradesUrl)
    })

    it('handles message link click', async () => {
      renderComponent()

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      const messageLink = await screen.findByText('Message', {}, { timeout: 200 })

      // Click should not throw error (modal is commented out but state should update)
      expect(() => fireEvent.click(messageLink)).not.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when user details fetch fails', async () => {
      renderComponent({
        headerConfig: {
          userDetailsQuery: createMockUserDetailsHandler(undefined, true),
        },
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      expect(await screen.findByText('Failed to load user details', {}, { timeout: 200 })).toBeInTheDocument()
    })

    it('does not display user details when error occurs', async () => {
      renderComponent({
        headerConfig: {
          userDetailsQuery: createMockUserDetailsHandler(undefined, true),
        },
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByText('Failed to load user details', {}, { timeout: 200 })

      expect(screen.queryByTestId('lmgb-student-popover-avatar')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible close button', async () => {
      renderComponent()

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      const closeButton = await screen.findByRole('button', { name: 'Close' }, { timeout: 200 })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Data Loading', () => {
    it('does not fetch user details until popover is opened', () => {
      const mockHandler = jest.fn(createMockUserDetailsHandler())
      renderComponent({
        headerConfig: {
          userDetailsQuery: mockHandler,
        },
      })

      // Handler should not be called until popover is opened
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('fetches user details when popover is opened', async () => {
      const mockHandler = jest.fn(createMockUserDetailsHandler())
      renderComponent({
        headerConfig: {
          userDetailsQuery: mockHandler,
        },
      })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await waitFor(() => {
        expect(mockHandler).toHaveBeenCalledWith('123', '1')
      }, { timeout: 200 })
    })
  })

  describe('Edge Cases', () => {
    it('handles missing data gracefully', async () => {
      renderComponent({ outcomes: undefined, rollups: undefined })

      const link = screen.getByTestId('student-cell-link')
      fireEvent.click(link)

      await screen.findByTestId('lmgb-student-popover-avatar', {}, { timeout: 200 })

      // Should not crash and still display user details
      expect(screen.getAllByText(mockStudent.display_name).length).toBeGreaterThan(0)
    })
  })
})
