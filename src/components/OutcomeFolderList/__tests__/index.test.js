import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeFolderList from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeFolderList', () => {
  const outcomes = [
    {id: '1', label: 'ABC', title: 'Title1'},
    {id: '2', label: 'DEF', title: 'Title2'},
    {id: '3', label: 'GHI', title: 'Title3'},
  ]

  function makeProps(props = {}) {
    return Object.assign(
      {
        outcomes,
        getOutcomeSummary: jest.fn(),
        setActiveCollection: jest.fn(),
        toggleExpandedIds: jest.fn(),
      },
      props
    )
  }

  it('renders nothing if there are no outcomes', () => {
    render(<OutcomeFolderList {...makeProps({outcomes: []})} />)
    expect(screen.queryByText('Title1')).not.toBeInTheDocument()
    expect(screen.queryByText('Title2')).not.toBeInTheDocument()
    expect(screen.queryByText('Title3')).not.toBeInTheDocument()
  })

  it('renders a folder for each outcome', () => {
    render(<OutcomeFolderList {...makeProps()} />)

    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()

    expect(screen.getByText('ABC')).toBeInTheDocument()
    expect(screen.getByText('DEF')).toBeInTheDocument()
    expect(screen.getByText('GHI')).toBeInTheDocument()
  })

  it('passes the correct props to OutcomeFolder components', () => {
    const props = makeProps()
    render(<OutcomeFolderList {...props} />)

    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()

    expect(screen.getByText('ABC')).toBeInTheDocument()
    expect(screen.getByText('DEF')).toBeInTheDocument()
    expect(screen.getByText('GHI')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeFolderList {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
