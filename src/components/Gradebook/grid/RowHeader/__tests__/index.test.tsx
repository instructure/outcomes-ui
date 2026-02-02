import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Table } from '@instructure/ui-table'
import { RowHeader, RowHeaderProps } from '../index'

describe('RowHeader', () => {
  const renderInTable = (ui: React.ReactElement) => {
    return render(
      <Table caption="Test Table">
        <Table.Body>
          <Table.Row>{ui}</Table.Row>
        </Table.Body>
      </Table>,
    )
  }

  const defaultProps: RowHeaderProps = {
    children: 'Row Header Content',
  }

  it('renders children content', () => {
    renderInTable(<RowHeader {...defaultProps} />)
    expect(screen.getByText('Row Header Content')).toBeInTheDocument()
  })

  it('renders as th element by default', () => {
    renderInTable(<RowHeader {...defaultProps} />)
    const header = screen.getByRole('rowheader')
    expect(header.tagName).toBe('TH')
  })

  it('renders as div when isStacked is true', () => {
    render(<RowHeader {...defaultProps} isStacked={true} />)
    const header = screen.getByRole('rowheader')
    expect(header.tagName).toBe('DIV')
  })

  it('applies row scope to th element', () => {
    renderInTable(<RowHeader {...defaultProps} />)
    const header = screen.getByRole('rowheader')
    expect(header).toHaveAttribute('scope', 'row')
  })

  it('applies rowheader role when isStacked is true', () => {
    render(<RowHeader {...defaultProps} isStacked={true} />)
    const header = screen.getByRole('rowheader')
    expect(header).toHaveAttribute('role', 'rowheader')
  })

  it('applies sticky position when isSticky is true', () => {
    renderInTable(<RowHeader {...defaultProps} isSticky={true} />)
    const header = screen.getByRole('rowheader')
    expect(header).toHaveStyle({position: 'sticky'})
  })

  it('applies primary background when isSticky is true and no background provided', () => {
    renderInTable(<RowHeader {...defaultProps} isSticky={true} />)
    const header = screen.getByRole('rowheader')
    expect(header).toBeInTheDocument()
  })

  it('applies data-cell-id attribute', () => {
    renderInTable(<RowHeader {...defaultProps} data-cell-id="cell-0-0" />)
    const header = screen.getByRole('rowheader')
    expect(header).toHaveAttribute('data-cell-id', 'cell-0-0')
  })

  it('applies custom background when provided', () => {
    renderInTable(<RowHeader {...defaultProps} background="secondary" />)
    const header = screen.getByRole('rowheader')
    expect(header).toBeInTheDocument()
  })
})
