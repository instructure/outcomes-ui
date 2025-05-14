import { expect, jest } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import HeaderDetails from '../index'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

// Mock Instructure UI components
jest.mock('@instructure/ui-progress', () => ({
  ProgressBar: () => <div data-testid="progress-bar" />
}))

jest.mock('@instructure/ui-tooltip', () => ({
  Tooltip: ({ renderTip, children }) => (
    <div data-testid="tooltip" data-tip={renderTip}>
      {children}
    </div>
  )
}))

describe('OutcomesPerStudent/HeaderDetails', () => {
  function makeProps (props) {
    return Object.assign({
      outcomeResult: {
        outcome: {
          id: '1',
          label: 'FOO'
        },
        count: 10,
        mastery_count: 5,
        childArtifactCount: 12
      },
      viewReportAlignment: jest.fn(),
      getReportOutcome: jest.fn().mockReturnValue({ id: '1', label: 'FOO', title: 'bar' }),
      isOpen: false,
      closeReportAlignment: jest.fn(),
      showRollups: true
    }, props)
  }

  it('includes a progress bar', () => {
    render(<HeaderDetails {...makeProps()} />)
    const progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toBeInTheDocument()
  })

  it('hides the progress bar when rollups are hidden', () => {
    render(<HeaderDetails {...makeProps({ showRollups: false })} />)
    const progressBar = screen.queryByTestId('progress-bar')
    expect(progressBar).not.toBeInTheDocument()
  })

  it('includes the rollup summary', () => {
    render(<HeaderDetails {...makeProps()} />)
    const masteryCount = screen.getByText(/Mastery/)
    const didntMeetCount = screen.getByText(/Didn't Meet/)

    expect(masteryCount).toBeInTheDocument()
    expect(didntMeetCount).toBeInTheDocument()
  })

  it('hides the rollup summary when rollups are hidden', () => {
    render(<HeaderDetails {...makeProps({ showRollups: false })} />)
    const masteryCount = screen.queryByText(/Mastery/)
    const didntMeetCount = screen.queryByText(/Didn't Meet/)

    expect(masteryCount).not.toBeInTheDocument()
    expect(didntMeetCount).not.toBeInTheDocument()
  })

  it('does include tooltip', () => {
    const withUsesBank = {
      outcomeResult: {
        outcome: {
          id: '1',
          label: 'FOO'
        },
        count: 10,
        mastery_count: 5,
        childArtifactCount: 12,
        usesBank: true
      }
    }
    render(<HeaderDetails {...makeProps(withUsesBank)} />)
    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute('data-tip', 'Variable due to All/Random selection from item bank')
  })

  it('does not include tooltip', () => {
    render(<HeaderDetails {...makeProps()} />)
    const tooltip = screen.queryByTestId('tooltip')
    expect(tooltip).not.toBeInTheDocument()
  })

  it('includes the count of aligned items', () => {
    render(<HeaderDetails {...makeProps()} />)
    expect(screen.getByText('12 Questions')).toBeInTheDocument()
  })

  it('does not include the count of aligned items if not specified', () => {
    const props = makeProps()
    props.outcomeResult.childArtifactCount = null
    render(<HeaderDetails {...props} />)
    expect(screen.queryByText(/Questions/)).not.toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const { container } = render(<HeaderDetails {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
