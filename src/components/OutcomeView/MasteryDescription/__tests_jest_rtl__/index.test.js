import { expect } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MasteryDescription from '../index'
import checkA11y from '../../../../test/checkA11y'


describe('MasteryDescription', () => {
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
      artifactTypeName: 'Quiz',
      displayMasteryPercentText: true,
      scoringMethod
    }, props)
  }

  it('renders spinner with no scoring method', () => {
    const props = makeProps({
      scoringMethod: null
    })
    render(<MasteryDescription {...props} />, {attachTo: document.body})
    expect(screen.getByRole('img', {name: 'Loading'})).toBeInTheDocument()
  })

  it('does not render mastery percent text if displayMasteryPercentText is false', () => {
    const props = makeProps({
      displayMasteryPercentText: false
    })
    render(<MasteryDescription {...props} />)
    expect(screen.queryByText('By aligning to this Quiz if the student scores above 60% mastery will be achieved.'))
      .toBeNull()
  })

  it('does not render mastery percent text if no artifactTypeName provided', () => {
    const props = makeProps({
      artifactTypeName: null
    })
    render(<MasteryDescription {...props} />)
    expect(screen.queryByText('By aligning to this Quiz if the student scores above 60% mastery will be achieved.'))
      .toBeNull()
  })

  it('renders mastery percent text', () => {
    const props = makeProps({})
    render(<MasteryDescription {...props} />)
    expect(screen.getByText('By aligning to this Quiz if the student scores above 60% mastery will be achieved.'))
      .toBeInTheDocument()
  })

  it('renders mastery description for decaying_average', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'decaying_average'}
    })
    render(<MasteryDescription {...props} />)
    expect(screen.getByText('Mastery calculated by Decaying Average', {exact: false}))
      .toBeInTheDocument()
  })

  it('renders mastery description for n_mastery', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'n_mastery'}
    })
    render(<MasteryDescription {...props} />)
    const txt = screen.getByText(/n Number of Times/i)
    expect(txt).toBeInTheDocument()
  })

  it('renders mastery description for highest', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'highest'}
    })
    render(<MasteryDescription {...props} />)
    expect(screen.getByText(/Highest Score/i)).toBeInTheDocument()
  })

  it('renders mastery description for latest', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'latest'}
    })
    render(<MasteryDescription {...props} />)
    expect(screen.getByText(/Most Recent Score/i)).toBeInTheDocument()
  })

  it('meets a11y standards', () => {
    return checkA11y(<MasteryDescription {...makeProps()} />)
  })
})
