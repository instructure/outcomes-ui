import React from 'react'
import { jest, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import Score from '../index'

expect.extend(toHaveNoViolations)

jest.mock('@instructure/ui-icons', () => ({
  IconStarSolid: () => <span data-testid="icon-star-solid">★</span>
}))

describe('OutcomesPerStudent/Score', () => {
  function makeProps () {
    return {
      score: {
        percentScore: 0.5,
        points: 5,
        pointsPossible: 10
      },
      outcome: {
        scoring_method: {
          mastery_percent: 0.4
        }
      }
    }
  }

  it('includes the score', () => {
    render(<Score {...makeProps()} />)
    expect(screen.getByText(/5\/10/)).toBeInTheDocument()
  })

  it('does not include the score if no score provided', () => {
    const noPoints = {
      score: null,
      outcome: {
        scoring_method: {
          mastery_percent: 0.4
        }
      }
    }
    const { container } = render(<Score {...noPoints} />)
    expect(container.querySelector('div[data-automation="outcomesPerStudent__score"]')).toBeNull()
  })

  it('includes a star if percentScore is greater than mastery', () => {
    render(<Score {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.queryByTestId('icon-star-solid')).toBeInTheDocument()
  })

  it('includes a star if percentScore is equal to mastery', () => {
    const props = makeProps()
    props.score.percentScore = 0.4 // eslint-disable-line immutable/no-mutation
    render(<Score {...props} />, {disableLifecycleMethods: true})
    expect(screen.queryByTestId('icon-star-solid')).toBeInTheDocument()
  })

  it('does not include a star if percentScore is less than mastery', () => {
    const props = makeProps()
    props.score.percentScore = 0.1 // eslint-disable-line immutable/no-mutation
    render(<Score {...props} />, {disableLifecycleMethods: true})
    expect(screen.queryByTestId('icon-star-solid')).not.toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const { container } = render(<Score {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
