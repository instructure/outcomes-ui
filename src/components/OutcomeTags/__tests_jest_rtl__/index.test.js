import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import { IconOutcomesLine } from '@instructure/ui-icons'
import OutcomeTags from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeTags', () => {
  function makeProps (props = {}) {
    const deselectOutcomeIds = jest.fn()
    const outcomes = [
      { id: '1', label: 'ABC', title: 'Title1' },
      { id: '2', label: 'DEF', title: 'Title2' },
      { id: '3', label: 'GHI', title: 'Title3' },
      { id: '4', label: 'JKL', title: 'Title4', decorator: 'HIDE' }
    ]

    return Object.assign({
      outcomes,
      deselectOutcomeIds,
      emptyText: 'empty text',
    }, props)
  }

  it('renders an icon', () => {
    const { container } = render(<IconOutcomesLine/>)
    expect(container.querySelector('[name="IconOutcomes"]')).toBeInTheDocument()
  })

  it('renders tags for each outcome', () => {
    render(<OutcomeTags {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.queryAllByRole('button')).toHaveLength(3)
  })

  it('removes alignment when tag is clicked', () => {
    const props = makeProps()
    render(<OutcomeTags {...props} />)
    const first = screen.getByRole('button', {name: 'Remove Title1'})
    fireEvent.click(first)
    expect(props.deselectOutcomeIds).toHaveBeenCalledTimes(1)
    expect(props.deselectOutcomeIds).toHaveBeenCalledWith(['1'])
  })

  it('renders outcome titles', () => {
    render(<OutcomeTags {...makeProps()} />)
    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()
  })

  it('does not render outcome titles for hidden outcomes', () => {
    render(<OutcomeTags {...makeProps()} />)
    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()
    expect(screen.queryByText(/Title4/)).not.toBeInTheDocument()
  })

  it('does not render outcome labels', () => {
    render(<OutcomeTags {...makeProps()} />)
    expect(screen.queryByText(/ABC/)).not.toBeInTheDocument()
    expect(screen.queryByText(/DEF/)).not.toBeInTheDocument()
    expect(screen.queryByText(/GHI/)).not.toBeInTheDocument()
  })

  it('renders default text when outcome list empty', () => {
    const props = makeProps({ outcomes: [] })
    render(<OutcomeTags {...props} />)
    expect(screen.getByText(/empty text/)).toBeInTheDocument()
  })

  it('renders default text when all outcomes are hidden', () => {
    const props = makeProps({ outcomes: [{ id: '1', label: 'ABC', title: 'Title1', decorator: 'HIDE' }] })
    render(<OutcomeTags {...props} />)
    expect(screen.getByText(/empty text/)).toBeInTheDocument()
  })

  it('focuses on the prior tag when current tag deleted', () => {
    render(<OutcomeTags {...makeProps()} />)
    const last = screen.getByRole('button', {name: 'Remove Title3'})
    const previous = screen.getByRole('button', {name: 'Remove Title2'})
    fireEvent.click(last)
    expect(document.activeElement).toEqual(previous)
  })

  it('focuses on the next tag when the first tag is deleted', () => {
    render(<OutcomeTags {...makeProps()} />)
    const first = screen.getByRole('button', {name: 'Remove Title1'})
    const next = screen.getByRole('button', {name: 'Remove Title2'})
    fireEvent.click(first)
    expect(document.activeElement).toEqual(next)
  })

  it('focuses on empty results div when all tags are deleted', () => {
    const props = makeProps()
    const { rerender } = render(<OutcomeTags {...props} />)
    fireEvent.click(screen.getByRole('button', {name: 'Remove Title3'}))
    props.outcomes = []
    rerender(<OutcomeTags {...props} />)
    expect(document.activeElement).toEqual(screen.getByText('empty text'))
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeTags {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
