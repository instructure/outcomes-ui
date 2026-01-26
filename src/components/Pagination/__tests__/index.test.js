import React from 'react'
import { expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import Pagination from '../index'

describe('Pagination', () => {
  function makeProps (props = {}) {
    return Object.assign({
      numPages: 2,
      page: 1,
      updatePage: jest.fn(),
    }, props)
  }

  it('renders page numbers', () => {
    render(<Pagination {...makeProps()} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('calls updatePage when a page is clicked', () => {
    const props = makeProps()
    render(<Pagination {...props} />)
    const secondPageButton = screen.getByRole('button', { name: '2' })
    fireEvent.click(secondPageButton)
    expect(props.updatePage).toHaveBeenCalledWith(2)
  })

  it('does not include pagination for 0 results', () => {
    const props = makeProps({ numPages: 0 })
    render(<Pagination {...props} />, {disableLifecycleMethods: true})
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
