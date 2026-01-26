import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import {within} from '@testing-library/dom'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import Ratings from '../index'
import { ratings } from '../../../test/mockOutcomesData'

expect.extend(toHaveNoViolations)

describe('Ratings', () => {
  function makeProps (props = {}) {
    return Object.assign({
      ratings: ratings,
    }, props)
  }

  it('renders a table for the ratings', () => {
    render(<Ratings {...makeProps()} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('displays the mastery points correctly', () => {
    render(<Ratings {...makeProps({masteryPercent: 0.6, pointsPossible: 5})} />)
    expect(screen.getAllByText(/Exceeds Expectations/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Meets Expectations/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Does Not Meet Expectations/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Mastery at:/).length).toBeGreaterThan(0)
    expect(screen.getByText(/3 points/)).toBeInTheDocument()

  })

  it('calculates the ratings points correctly', () => {
    render(<Ratings {...makeProps({pointsPossible: 5})} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('formats the table in one column if displayed in tray', () => {
    render(<Ratings {...makeProps({isTray: true})} />)
    expect(within(screen.getByRole('table'))
      .getByText(/Proficiency Rating/))
      .toBeInTheDocument()
  })

  it('dispalys the correct text for points when displayed in tray', () => {
    render(<Ratings {...makeProps({pointsPossible: 5, isTray: true})} />)
    expect(screen.getByText(/5 points/)).toBeInTheDocument()
    expect(screen.getByText(/3 points/)).toBeInTheDocument()
    expect(screen.getAllByText(/0 points/).length).toBeGreaterThan(1)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<Ratings {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
