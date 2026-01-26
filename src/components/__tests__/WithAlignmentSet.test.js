import { expect, jest, describe, it } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import WithAlignmentSet from '../WithAlignmentSet'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

describe('WithAlignmentSet', () => {
  const Dummy = (props) => <div>{ props.text }</div> // eslint-disable-line react/prop-types
  const AlignedDummy = WithAlignmentSet(Dummy)

  function makeProps (props = {}) {
    return Object.assign({
      loadAlignments: jest.fn(),
      alignmentSetId: 'xxxooo'
    }, props)
  }

  it('renders the inner component with props', () => {
    render(<AlignedDummy {...makeProps({ text: 'foo' })} />)
    expect(screen.getByText('foo')).toBeInTheDocument()
  })

  it('loads alignments on mount', () => {
    const props = makeProps()
    render(<AlignedDummy {...props} />)
    expect(props.loadAlignments).toHaveBeenCalledTimes(1)
    // The function is called with alignmentSetId and undefined for launchContexts
    expect(props.loadAlignments).toHaveBeenCalledWith('xxxooo', undefined)
  })

  it('loads launch contexts on mount', () => {
    const launchContexts = [
      {uuid: 'foo', name: 'foo'},
      {uuid: 'bar', name: 'bar'}
    ]
    const props = makeProps({
      launchContexts: launchContexts
    })
    render(<AlignedDummy {...props} />)
    expect(props.loadAlignments).toHaveBeenCalledTimes(1)
    expect(props.loadAlignments.mock.calls[0][1]).toEqual(launchContexts)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<AlignedDummy {...makeProps({ text: 'accessible content' })} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
