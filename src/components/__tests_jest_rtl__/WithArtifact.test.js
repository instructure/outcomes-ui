import { expect, jest, describe, it } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import WithArtifact from '../WithArtifact'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

describe('WithArtifact', () => {
  const Dummy = (props) => <div>{ props.text }</div> // eslint-disable-line react/prop-types
  const AlignedDummy = WithArtifact(Dummy)

  const artifact = { artifactType: 'quizzes.quiz', artifactId: '1' }
  function makeProps (props = {}) {
    return {
      loadArtifact: jest.fn(),
      ...artifact,
      ...props
    }
  }

  it('renders the inner component with props', () => {
    render(<AlignedDummy {...makeProps({ text: 'foo' })} />)
    expect(screen.getByText('foo')).toBeInTheDocument()
  })

  it('loads alignments on mount', () => {
    const props = makeProps()
    render(<AlignedDummy {...props} />)
    expect(props.loadArtifact).toHaveBeenCalledTimes(1)
    expect(props.loadArtifact).toHaveBeenCalledWith(artifact)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<AlignedDummy {...makeProps({ text: 'accessible content' })} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
