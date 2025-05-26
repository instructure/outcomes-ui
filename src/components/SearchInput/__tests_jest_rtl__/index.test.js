import React from 'react'
import { jest, expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import SearchInput from '../index'

expect.extend(toHaveNoViolations)

describe('SearchInput', () => {
  function makeProps (props = {}) {
    return Object.assign({
      onChange: jest.fn(),
      onClear: jest.fn(),
      searchText: ''
    }, props)
  }

  it('includes a search icon', () => {
    render(<SearchInput {...makeProps()} />)
    expect(document.querySelector('[name="IconSearch"]')).toBeInTheDocument()
  })

  it('includes a clear search icon when text is in the search field', () => {
    render(<SearchInput {...makeProps({searchText: 'x'})} />)
    const theButton = screen.getByRole('button')
    expect(theButton.querySelector('[name="IconEnd"]')).toBeInTheDocument()
  })

  it('includes a clear search button when text is in the search field', () => {
    const props = makeProps({searchText: 'x'})
    render(<SearchInput {...props} />)
    const clearButton = screen.getByText(/Clear search/)
    expect(clearButton).toBeInTheDocument()
  })

  it('calls onClear when button is clicked', () => {
    const props = makeProps({searchText: 'x'})
    render(<SearchInput {...props} />)
    const clearButton = screen.getByText(/Clear search/)
    fireEvent.click(clearButton)
    expect(props.onClear).toHaveBeenCalledTimes(1)
  })

  it('meets a11y standards', async () => {
    const { container } = render(<SearchInput {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
