import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import OutcomeView from '../index'

expect.extend(toHaveNoViolations)

const sharedSpecs = (makeProps) => {
  it('includes the title and description', () => {
    render(<OutcomeView {...makeProps()} />)
    expect(screen.getByText('The rain in spain stays mainly...')).toBeInTheDocument()
    expect(screen.getByText(/My description/)).toBeInTheDocument()
  })

  it('sanitizes the description', () => {
    const props = makeProps({ description: 'The <blink>rain in Spain' })
    const { container } = render(<OutcomeView {...props} />)
    expect(container.innerHTML.includes('</blink>')).toBeTruthy()
  })

  it('includes counts if outcome result is defined', () => {
    const props = makeProps({
      outcomeResult: { count: 100, masteryCount: 50, averageScore: 0.5, childArtifactCount: 1, outcomeId: '1' }
    })
    const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__masteryCount"]').length).toEqual(1)
  })

  it('does not display scoring tiers if tiers not defined and no context to get defaults from', () => {
    const props = makeProps({ scoringTiers: null, context: null })
    const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__scoringTiers"]').length).toEqual(0)
  })

  it('includes Friendly Description if defined', () => {
    const props = makeProps({ friendlyDescription: 'This is another description' })
    render(<OutcomeView {...props} />)
    expect(screen.getByText(/Friendly Description/)).toBeInTheDocument()
    expect(screen.getByText(/This is another description/)).toBeInTheDocument()
  })

  it('ensures Friendly Description does not show', () => {
    const { container } = render(<OutcomeView {...makeProps()}/>)
    expect(container.querySelectorAll('[data-automation="outcomeView__friendly_description_header"]').length).toEqual(0)
    expect(container.querySelectorAll('[data-automation="outcomeView__friendly_description_expanded"]').length).toEqual(0)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<OutcomeView {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
}

describe('OutcomeView', () => {
  const scoringMethod = {
    id: 1,
    description: 'Some Method',
    points_possible: 5,
    mastery_percent: 0.6,
    algorithm: 'highest',
    algorithm_data: {}
  }

  const defaultProps = {
    description: 'My description',
    label: 'Foo',
    title: 'The rain in spain stays mainly...',
    scoringMethod,
    scoringTiers: [
      { id: 1, description: 'Cri 1', percent: 1.0 },
      { id: 2, description: 'Cri 2', percent: 0.6 },
      { id: 3, description: 'Cri 3', percent: 0.22222222 }
    ]
  }

  const makeProps = (props = {}) => {
    return {
      ...defaultProps,
      ...props
    }
  }

  sharedSpecs(makeProps)

  describe('context without proficiency data', () => {
    sharedSpecs((props = {}) => makeProps({
      context: {
        id: 1
      },
      ...props
    }))
  })

  it('does not include counts if outcome result not defined', () => {
    const { container } = render(<OutcomeView {...makeProps()} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__masteryCount"]').length).toEqual(0)
  })

  it('renders mastery description if displayMasteryDescription is true and no artifactTypeName provided', () => {
    const props = makeProps({
      displayMasteryDescription: true
    })
    const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__scoreMethodDescription"]').length).toEqual(1)
  })

  it('does not render mastery description if displayMasteryDescription is false', () => {
    const props = makeProps({
      displayMasteryDescription: false
    })
    const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__scoreMethodDescription"]').length).toEqual(0)
  })

  it('displays scoring tiers if scoring method and tiers defined', () => {
    const { container } = render(<OutcomeView {...makeProps()} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomeView__scoringTiers"]').length).toEqual(1)
  })

  describe('with context configured with proficiency', () => {
    const context = {
      id: 1,
      outcome_proficiency: {
        outcome_proficiency_ratings: [{
          color: 'FF00FF',
          mastery: false,
          points: 5.0,
          description: 'Exceeds Expectations'
        }, {
          color: 'FF00FF',
          mastery: true,
          points: 3.0,
          description: 'Meets Expectations.'
        }, {
          color: 'FF00FF',
          mastery: false,
          points: 0.0,
          description: 'Does Not Meet Expectations'
        }]
      },
      outcome_calculation_method: {
        calculation_method: 'highest',
        calculation_int: null,
      }
    }

    const runWithContextSpecs = (makeProps) => {
      sharedSpecs(makeProps)

      it('does not render mastery description if displayMasteryDescription is true and no artifactTypeName provided', () => {
        const props = makeProps({
          displayMasteryDescription: true
        })
        const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
        expect(container.querySelectorAll('[data-automation="outcomeView__scoreMethodDescription"]').length).toEqual(0)
      })

      it('does not display scoring tiers', () => {
        const { container } = render(
          <OutcomeView {...makeProps({ scoringTiers: null, context: null })} />,
          {disableLifecycleMethods: true}
        )
        expect(container.querySelectorAll('[data-automation="outcomeView__scoringTiers"]').length).toEqual(0)
      })

      it('displays scoring tiers if outcomeResult is defined', () => {
        const props = makeProps({
          outcomeResult: { count: 100, masteryCount: 50, averageScore: 0.5, childArtifactCount: 1, outcomeId: '1' }
        })
        const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
        expect(container.querySelectorAll('[data-automation="outcomeView__scoringTiers"]').length).toEqual(1)
      })

      it('passes prop.scoringTiers to <ScoringTiers /> if defined', () => {
        const props = makeProps({
          outcomeResult: { count: 100, masteryCount: 50, averageScore: 0.5, childArtifactCount: 1, outcomeId: '1' },
          scoringTiers: defaultProps.scoringTiers
        })
        render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
        defaultProps.scoringTiers.forEach((tier) => {
          expect(screen.getByText(tier.description)).toBeInTheDocument()
        })
      })

      it('renders mastery description if displayMasteryDescription is true, no artifactTypeName provided and outcomeResult defined', () => {
        const props = makeProps({
          displayMasteryDescription: true,
          outcomeResult: { count: 100, masteryCount: 50, averageScore: 0.5, childArtifactCount: 1, outcomeId: '1' }
        })
        const { container } = render(<OutcomeView {...props} />, {disableLifecycleMethods: true})
        expect(container.querySelectorAll('[data-automation="outcomeView__scoreMethodDescription"]').length).toEqual(1)
      })
    }

    describe('without scoringTiers and scoringMethod from props', () => {
      runWithContextSpecs((props = {}) => makeProps({
        context,
        scoringTiers: null,
        scoringMethod: null,
        ...props
      }))
    })

    describe('with scoringTiers and scoringMethod from props', () => {
      runWithContextSpecs((props = {}) => makeProps({
        context,
        ...props
      }))
    })
  })
})
