import { expect, jest } from '@jest/globals'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {within} from '@testing-library/dom'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import OutcomesPerStudent from '../index'
import {COMPLETED, REPORT_DOWNLOAD_FF} from '../../../constants.js'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

jest.mock('../Header/index.js', () => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    return <button
      data-testid="mocked-header"
      onClick={props.viewReportAlignment}
    > Mocked Button </button>
  }
})

describe('OutcomesPerStudent/index', () => {
  function makeProps (props = {}) {
    return Object.assign({
      loadPage: jest.fn().mockResolvedValue(),
      loading: false,
      loadRemainingPages: jest.fn(),
      csvFetchingStatus: COMPLETED,
      formatCSVData: jest.fn(),
      clearReportStore: jest.fn(),
      getReportOutcome: jest.fn().mockReturnValue({ id: 1, label: 'Foo.PRQ.2', title: 'Learn stuff' }),
      getScore: jest.fn(),
      setError: jest.fn(),
      isOpen: jest.fn().mockReturnValue(false),
      viewReportAlignment: jest.fn(),
      closeReportAlignment: jest.fn(),
      artifactType: 'foo',
      artifactId: 'bar',
      scope: 'foo:bar',
      hasAnyOutcomes: true,
      currentPage: 3,
      pageCount: 5,
      rollups: [
        {
          outcomeId: 101,
          count: 100,
          mastery_count: 11,
          alignedItems: 1
        },
        {
          outcomeId: 202,
          alignedItems: 5,
          mastery_count: 19,
          count: 20
        },
        {
          outcomeId: 303,
          mastery_count: 12,
          count: 20
        }
      ],
      users: [
        {
          uuid: 1,
          full_name: 'Darius Jackson'
        },
        {
          uuid: 2,
          full_name: 'Penelope Cooper'
        },
        {
          uuid: 3,
          full_name: 'Gerry Gergich'
        },
        {
          uuid: 4,
          full_name: 'Slim Pickens'
        },
        {
          uuid: 5,
          full_name: 'Sir Darryl Roundtree'
        }
      ],
      features: []
    }, props)
  }

  it('renders a header for each outcome', () => {
    render(<OutcomesPerStudent {...makeProps()} />)
    // We have 3 outcomes, so we should find 3 outcome headers
    const outcomeHeaders = screen.getAllByRole('columnheader')
    // +1 because there's an additional columnheader for the corner element
    expect(outcomeHeaders.length).toBe(4)
  })

  it('generates the correct viewReportAlignment method when clicking on an outcome', () => {
    const props = makeProps()
    render(<OutcomesPerStudent {...props} />)

    // Find all outcome links and click the last one
    const outcomeLinks = screen.getAllByTestId('mocked-header')
    fireEvent.click(outcomeLinks[outcomeLinks.length - 1])

    expect(props.viewReportAlignment).toHaveBeenCalledTimes(1)
    expect(props.viewReportAlignment).toHaveBeenCalledWith(303)
  })

  it('renders a row for each student', () => {
    render(<OutcomesPerStudent {...makeProps()} />)
    // Each student has their name in a row header
    const studentRows = screen.getAllByRole('rowheader')
    // exclude aggregate column
      .filter(row => !row.innerHTML.includes('Details'))
    expect(studentRows.length).toBe(5)
  })

  it('renders scores for each student-outcome combination', () => {
    render(<OutcomesPerStudent {...makeProps()} />)
    // 5 students * 3 outcomes = 15 scores
    const scores = screen.getAllByRole('gridcell')
    // exclude aggregate cells
      .filter(cell => !cell.innerHTML.includes('NaN Didn\'t Meet'))
    expect(scores.length).toBe(15)
  })

  it('renders pagination', () => {
    render(<OutcomesPerStudent {...makeProps()} />)
    // 5 pages of pagination
    const navigation = screen.getByRole('navigation')
    const navigationButtons = within(navigation).getAllByRole('button')
    expect(navigationButtons.length).toBe(5)
  })

  it('renders the billboard message if no results yet exist', () => {
    render(<OutcomesPerStudent {...makeProps({users: [], hasAnyOutcomes: true})} />)
    const heading = screen.getByText("Looks like you're a little early")
    expect(heading).toBeInTheDocument()
  })

  it('renders the billboard message if no outcomes are aligned', () => {
    render(<OutcomesPerStudent {...makeProps({users: [], hasAnyOutcomes: false})} />)
    const heading = screen.getByText('There is no report here to show')
    expect(heading).toBeInTheDocument()
  })

  describe('ExportCSVButton', () => {
    it('renders if the FF is enabled, the page is loaded, and there are users and outcomes', () => {
      render(<OutcomesPerStudent {...makeProps({features: [REPORT_DOWNLOAD_FF]})} />)
      const exportButton = screen.getByRole('button', { name: /Export CSV/ })
      expect(exportButton).toBeInTheDocument()
    })

    describe('does not render if', () => {
      it('the FF is disabled', () => {
        render(<OutcomesPerStudent {...makeProps({})} />)
        const exportButton = screen.queryByRole('button', { name: /Export CSV/ })
        expect(exportButton).not.toBeInTheDocument()
      })

      it('there are no students', () => {
        render(<OutcomesPerStudent {...makeProps({users: []})} />)
        const exportButton = screen.queryByRole('button', { name: /Export CSV/ })
        expect(exportButton).not.toBeInTheDocument()
      })

      it('there are no outcomes', () => {
        render(<OutcomesPerStudent {...makeProps({hasAnyOutcomes: false})} />)
        const exportButton = screen.queryByRole('button', { name: /Export CSV/ })
        expect(exportButton).not.toBeInTheDocument()
      })
    })
  })

  it('calls clearReportStore when about to unmount', () => {
    const props = makeProps()
    const { unmount } = render(<OutcomesPerStudent {...props} />)
    expect(props.clearReportStore).not.toHaveBeenCalled()
    unmount()
    expect(props.clearReportStore).toHaveBeenCalledTimes(1)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<OutcomesPerStudent {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
