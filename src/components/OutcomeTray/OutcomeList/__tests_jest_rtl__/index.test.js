import { expect, jest } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import OutcomeList from '../index'
import { OUTCOME_1 } from '../../../../test/mockOutcomesData'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

describe('OutcomeList', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcomes: [OUTCOME_1],
      setFocusedOutcome: jest.fn(),
      isOutcomeSelected: jest.fn(),
      selectOutcomeIds: jest.fn(),
      deselectOutcomeIds: jest.fn(),
      isLoading: false,
    }, props)
  }

  it('renders an AlignmentItem', () => {
    render(<OutcomeList {...makeProps()} />)
    expect(screen.getByText('tA1')).toBeInTheDocument()
  })

  it('renders loading spinner when state is loading', () => {
    const props = makeProps({ isLoading: true })
    render(<OutcomeList {...props} />)
    expect(screen.getByRole('img', { value: { text: 'Loading' } })).toBeInTheDocument()
  })

  it('renders pagination', () => {
    render(<OutcomeList {...makeProps({listPage: 0, listTotal: 1})} />)
    expect(screen.queryByRole('navigation')).toBeNull()
    render(<OutcomeList {...makeProps({listPage: 0, listTotal: 11})} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const { container } = render(<OutcomeList {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
