import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect} from '@jest/globals'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import AlignmentCount from '../index'

expect.extend(toHaveNoViolations)

describe('AlignmentCount', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        count: 100,
      },
      props
    )
  }

  it('renders the count', () => {
    render(<AlignmentCount {...makeProps()} />)
    expect(screen.getByText('(100)')).toBeInTheDocument()
  })

  it('does not render when count is null', () => {
    const props = makeProps({count: null})
    render(<AlignmentCount {...props} />)
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<AlignmentCount {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
