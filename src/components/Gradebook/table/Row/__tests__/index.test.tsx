import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Table } from '@instructure/ui-table'
import { Cell } from '@/components/Gradebook/table/Cell'
import { Row } from '..'

describe('Row', () => {
  const renderInTable = (ui: React.ReactElement, tableProps = {}) => {
    return render(
      <Table caption="Test Table" {...tableProps}>
        <Table.Body>{ui}</Table.Body>
      </Table>,
    )
  }

  it('renders children content', () => {
    renderInTable(
      <Row>
        <Cell>Cell 1</Cell>
        <Cell>Cell 2</Cell>
      </Row>,
    )
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
  })

  it('renders as tr element by default', () => {
    renderInTable(
      <Row>
        <Cell>Test</Cell>
      </Row>,
    )
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(0)
  })

  it('calls setRef with the element when provided', () => {
    const setRef = jest.fn()
    renderInTable(
      <Row setRef={setRef}>
        <Cell>Test</Cell>
      </Row>,
    )
    expect(setRef).toHaveBeenCalled()
  })

  it('renders non-element children that pass filter', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    renderInTable(
      <Row>
        <Cell>Cell 1</Cell>
        {'Plain text'}
        <Cell>Cell 2</Cell>
      </Row>,
    )
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Plain text')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('renders as div with role when table is stacked', () => {
    const { container } = renderInTable(
      <Row>
        <Cell>Test</Cell>
      </Row>,
      { layout: 'stacked' },
    )
    const row = container.querySelector('[role="row"]')
    expect(row).toBeInTheDocument()
    expect(row?.tagName).toBe('DIV')
  })
})
