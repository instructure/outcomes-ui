
import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import MasteryCounts from '../index'

jest.mock('@instructure/ui-progress', () => ({
  ProgressBar: (props) => <div data-testid="progress-bar" {...props} />
}))

expect.extend(toHaveNoViolations)

describe('OutcomeView MasteryCounts', () => {
  const scoringMethod = {
    id: 1,
    description: 'Some Method',
    points_possible: 5,
    mastery_percent: 0.6,
    algorithm: 'highest',
    algorithm_data: {}
  }

  function makeProps (props = {}) {
    return Object.assign({
      scoringMethod,
      outcomeResult: {
        masteryCount: 10,
        count: 20,
        averageScore: 0.5,
        childArtifactCount: 1,
        outcomeId: '1'
      }
    }, props)
  }

  it('includes a progress bar', () => {
    render(<MasteryCounts {...makeProps()} />)
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<MasteryCounts {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
