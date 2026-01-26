import {expect} from '@jest/globals'
import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeDescription from '../index'
import {ratings} from '../../../test/mockOutcomesData'

expect.extend(toHaveNoViolations)

describe('OutcomeDescription', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        description: 'Hello there',
        truncated: true,
        ratings: ratings,
        calculationMethod: 'latest',
        calculationInt: null,
      },
      props
    )
  }

  it('renders outcome description', () => {
    render(<OutcomeDescription {...makeProps()} />)
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('sanitizes an outcome description', () => {
    render(<OutcomeDescription {...makeProps({description: 'Hello <img src="bigimage" />'})} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(document.querySelector('img')).not.toBeInTheDocument()
  })

  it('renders a TruncateText element if the outcome description is long', () => {
    const {container} = render(
      <OutcomeDescription {...makeProps({description: 'a'.repeat(500)})} />
    )
    expect(
      container.querySelector('[data-automation="outcomeDescription__description"]')
    ).toBeInTheDocument()
  })

  it('renders outcome label and description', () => {
    render(<OutcomeDescription {...makeProps({label: 'Outcome label'})} />)
    expect(screen.getByText('Outcome label')).toBeInTheDocument()
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('renders only the description if user cannot manage outcomes', () => {
    render(
      <OutcomeDescription {...makeProps({label: 'Outcome label', canManageOutcomes: false})} />
    )
    expect(screen.queryByText('Outcome label')).not.toBeInTheDocument()
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('renders a friendly description if there is one and if expanded', () => {
    render(
      <OutcomeDescription
        {...makeProps({friendlyDescription: 'Outcome Friendly Description', truncated: false})}
      />
    )
    expect(screen.getByText('Friendly Description')).toBeInTheDocument()
    expect(screen.getByText('Outcome Friendly Description')).toBeInTheDocument()
  })

  it('does not render a friendly description if not expanded', () => {
    render(
      <OutcomeDescription {...makeProps({friendlyDescription: 'Outcome Friendly Description'})} />
    )
    expect(screen.queryByText('Friendly Description')).not.toBeInTheDocument()
    expect(screen.queryByText('Outcome Friendly Description')).not.toBeInTheDocument()
  })

  it('renders the ratings if expanded', () => {
    render(<OutcomeDescription {...makeProps({truncated: false})} />)
    // Check for rating text that would appear when expanded
    expect(screen.getByText('Proficiency Calculation:')).toBeInTheDocument()
  })

  it('does not render the ratings if not expanded', () => {
    render(<OutcomeDescription {...makeProps()} />)
    expect(screen.queryByText('Proficiency Calculation:')).not.toBeInTheDocument()
  })

  describe('renders proficiency calculation text correctly', () => {
    it('for latest method', () => {
      render(<OutcomeDescription {...makeProps({truncated: false})} />)
      expect(screen.getByText('Most Recent Score')).toBeInTheDocument()
    })

    it('for highest method', () => {
      render(
        <OutcomeDescription {...makeProps({calculationMethod: 'highest', truncated: false})} />
      )
      expect(screen.getByText('Highest Score')).toBeInTheDocument()
    })

    it('for n mastery method', () => {
      const n_mastery = {n_mastery_count: 3}
      render(
        <OutcomeDescription
          {...makeProps({
            calculationMethod: 'n_mastery',
            calculationInt: n_mastery,
            truncated: false,
          })}
        />
      )
      expect(screen.getByText('Achieve Mastery 3 times')).toBeInTheDocument()
    })

    it('for average method', () => {
      render(
        <OutcomeDescription {...makeProps({calculationMethod: 'average', truncated: false})} />
      )
      expect(screen.getByText('Average')).toBeInTheDocument()
    })

    it('for decaying average method', () => {
      const n_mastery = {decaying_average_percent: 65}
      render(
        <OutcomeDescription
          {...makeProps({
            calculationMethod: 'decaying_average',
            calculationInt: n_mastery,
            truncated: false,
          })}
        />
      )
      expect(screen.getByText('Decaying Average - 65%/35%')).toBeInTheDocument()
    })
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeDescription {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
