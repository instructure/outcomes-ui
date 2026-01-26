import {expect} from '@jest/globals'
import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeLabels from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeLabels', () => {
  function makeProps(props = {}) {
    const outcomes = [
      {id: '1', label: 'ABC', title: 'Title1'},
      {id: '2', label: 'DEF', title: 'Title2'},
      {id: '3', label: 'GHI', title: 'Title3'},
    ]

    return Object.assign(
      {
        outcomes,
        emptyText: 'No Outcomes are currently selected',
      },
      props
    )
  }

  it('renders an icon', () => {
    const {container} = render(<OutcomeLabels {...makeProps()} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders outcome titles', () => {
    render(<OutcomeLabels {...makeProps()} />)
    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()
  })

  it('does not render outcome labels', () => {
    render(<OutcomeLabels {...makeProps()} />)
    expect(screen.queryByText('ABC')).not.toBeInTheDocument()
    expect(screen.queryByText('DEF')).not.toBeInTheDocument()
    expect(screen.queryByText('GHI')).not.toBeInTheDocument()
  })

  it('renders default text when outcome list empty', () => {
    const props = makeProps({outcomes: []})
    render(<OutcomeLabels {...props} />)
    expect(screen.getByText('No Outcomes are currently selected')).toBeInTheDocument()
  })

  it('renders default text when all outcomes are hidden', () => {
    const props = makeProps({
      outcomes: [
        {id: '1', label: 'ABC', title: 'Title1', decorator: 'HIDE'},
        {id: '2', label: 'DEF', title: 'Title2', decorator: 'HIDE'},
        {id: '3', label: 'GHI', title: 'Title3', decorator: 'HIDE'},
      ],
    })
    render(<OutcomeLabels {...props} />)
    expect(screen.getByText('No Outcomes are currently selected')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeLabels {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
