import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import ScoringTiers from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeView ScoringTiers', () => {
  const scoringMethod = {
    id: 1,
    description: 'Some Method',
    points_possible: 5,
    mastery_percent: 0.6,
    algorithm: 'highest',
    algorithm_data: {}
  }

  const outcomeResult = {
    childArtifactCount: 0,
    masteryCount: 0,
    count: 0,
    averageScore: 0.6,
    outcomeId: 'foo'
  }

  const scoringTiers = [
    { id: 1, description: 'Cri 1', percent: 1.0 },
    { id: 2, description: 'Cri 2', percent: 0.6 },
    { id: 3, description: 'Cri 3', percent: 0.22222222 }
  ]

  function makeProps (props = {}) {
    return Object.assign({
      scoringMethod,
      scoringTiers,
    }, props)
  }

  it('displays scoring tiers', () => {
    const { container } = render(<ScoringTiers {...makeProps()} />)
    const scoringTiersDisplayed = Array.from(container.querySelectorAll('[data-automation="outcomeView__scoringTier"]'))
    expect(scoringTiersDisplayed.length).toBe(scoringTiers.length)
  })

  it('shows mastery between correct tiers', () => {
    render(<ScoringTiers {...makeProps()} />)
    // only one is found or it throws an error
    expect(screen.getByText('1.11')).toBeInTheDocument()
  })

  it('shows average between the correct tiers', () => {
    const props = makeProps({
      outcomeResult: {
        ...outcomeResult,
        averageScore: 0.99
      }
    })
    render(<ScoringTiers {...props} />)
    // only one is found or it throws an error
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows mastery above average if they are equal', () => {
    const props = makeProps({
      outcomeResult: {
        averageScore: 0.6,
        ...outcomeResult
      }
    })
    render(<ScoringTiers {...props} />)
    expect(document.querySelectorAll('.outcomeViewMastery').length).toBe(1)
    expect(document.querySelectorAll('.outcomeViewAverage').length).toBe(1)

  })

  it('rounds mastery points', () => {
    const props = makeProps()
    render(<ScoringTiers {...props} />)
    expect(screen.getByText('1.11')).toBeInTheDocument()
  })

  it('renders tier mastery count', () => {
    const props = makeProps({
      scoringTiers: [
        { id: 1, description: 'Cri 1', percent: 1.0, count: 10 }
      ]
    })
    render(<ScoringTiers {...props} />)
    expect(screen.getByText(/Students/)).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const { container } = render(<ScoringTiers {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
