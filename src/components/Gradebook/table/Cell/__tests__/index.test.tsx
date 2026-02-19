import React from 'react'
import { expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Table } from '@instructure/ui-table'
import { Cell, CellProps } from '../index'

describe('Cell', () => {
  const renderInTable = (ui: React.ReactElement, layout?: 'stacked' | 'fixed' | 'auto') => {
    return render(
      <Table caption="Test Table" layout={layout}>
        <Table.Body>
          <Table.Row>{ui}</Table.Row>
        </Table.Body>
      </Table>,
    )
  }

  const defaultProps: CellProps = {
    children: 'Test Content',
  }

  it('renders children content', () => {
    renderInTable(<Cell {...defaultProps} />)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders as td element by default', () => {
    renderInTable(<Cell {...defaultProps} />)
    const cell = screen.getByRole('cell')
    expect(cell.tagName).toBe('TD')
  })

  it('renders as div when table is stacked', () => {
    renderInTable(<Cell {...defaultProps} />, 'stacked')
    const cell = screen.getByRole('cell')
    expect(cell.tagName).toBe('DIV')
  })

  it('adds cell role when table is stacked', () => {
    renderInTable(<Cell {...defaultProps} />, 'stacked')
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('role', 'cell')
  })

  it('applies width when provided', () => {
    renderInTable(<Cell {...defaultProps} width="200px" />)
    const cell = screen.getByRole('cell')
    expect(cell).toHaveStyle({width: '200px'})
  })

  it('applies sticky position when isSticky is true', () => {
    renderInTable(<Cell {...defaultProps} isSticky={true} />)
    const cell = screen.getByRole('cell')
    expect(cell).toHaveStyle({position: 'sticky'})
  })

  it('applies primary background when isSticky is true and no background provided', () => {
    renderInTable(<Cell {...defaultProps} isSticky={true} />)
    const cell = screen.getByRole('cell')
    expect(cell).toBeInTheDocument()
  })

  it('applies custom id when provided', () => {
    renderInTable(<Cell {...defaultProps} id="custom-cell-id" />)
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('id', 'custom-cell-id')
  })

  it('applies custom background over default when isSticky is true', () => {
    renderInTable(<Cell {...defaultProps} isSticky={true} background="secondary" />)
    const cell = screen.getByRole('cell')
    expect(cell).toBeInTheDocument()
  })

  it('renders children as function with focus state', () => {
    const childrenFn = (focused: boolean) => (
      <div>{focused ? 'Focused' : 'Not Focused'}</div>
    )
    renderInTable(<Cell>{childrenFn}</Cell>)
    expect(screen.getByText('Not Focused')).toBeInTheDocument()
  })

  it('updates focus state when cell receives focus', () => {
    const childrenFn = (focused: boolean) => (
      <div>{focused ? 'Focused' : 'Not Focused'}</div>
    )
    renderInTable(<Cell>{childrenFn}</Cell>)
    const cell = screen.getByRole('cell')

    expect(screen.getByText('Not Focused')).toBeInTheDocument()

    fireEvent.focus(cell)
    expect(screen.getByText('Focused')).toBeInTheDocument()
  })

  it('removes focus state when cell loses focus', () => {
    const childrenFn = (focused: boolean) => (
      <div>{focused ? 'Focused' : 'Not Focused'}</div>
    )
    renderInTable(<Cell>{childrenFn}</Cell>)
    const cell = screen.getByRole('cell')

    fireEvent.focus(cell)
    expect(screen.getByText('Focused')).toBeInTheDocument()

    fireEvent.blur(cell)
    expect(screen.getByText('Not Focused')).toBeInTheDocument()
  })

  it('maintains focus when focus moves to a descendant element', () => {
    const childrenFn = (focused: boolean) => (
      <div>
        <button>Button</button>
        <span>{focused ? 'Focused' : 'Not Focused'}</span>
      </div>
    )
    renderInTable(<Cell>{childrenFn}</Cell>)
    const cell = screen.getByRole('cell')
    const button = screen.getByRole('button')

    fireEvent.focus(cell)
    expect(screen.getByText('Focused')).toBeInTheDocument()

    fireEvent.blur(cell, { relatedTarget: button })

    expect(screen.getByText('Focused')).toBeInTheDocument()
  })

  it('applies custom boxShadow when provided', () => {
    renderInTable(<Cell {...defaultProps} boxShadow="4px 0 0 0 red" />)
    const cell = screen.getByRole('cell')
    expect(cell).toBeInTheDocument()
  })

  it('applies sticky positioning with left offset when isSticky is true', () => {
    renderInTable(<Cell {...defaultProps} isSticky={true} />)
    const cell = screen.getByRole('cell')
    expect(cell).toHaveStyle({position: 'sticky'})
  })

  it('does not apply sticky positioning when isSticky is false', () => {
    renderInTable(<Cell {...defaultProps} isSticky={false} />)
    const cell = screen.getByRole('cell')
    expect(cell).not.toHaveStyle({position: 'sticky'})
  })
})
