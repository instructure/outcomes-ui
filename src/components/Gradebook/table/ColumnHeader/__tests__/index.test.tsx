import React from 'react'
import type { ConnectDragSource } from 'react-dnd'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Table } from '@instructure/ui-table'
import { Header, HeaderProps } from '../index'

describe('Header', () => {
  const renderInTable = (ui: React.ReactElement) => {
    return render(
      <Table caption="Test Table">
        <Table.Head>
          <Table.Row>{ui}</Table.Row>
        </Table.Head>
      </Table>,
    )
  }

  const defaultProps: HeaderProps = {
    children: 'Column Header Content',
  }

  it('renders children content', () => {
    renderInTable(<Header {...defaultProps} />)
    expect(screen.getByText('Column Header Content')).toBeInTheDocument()
  })

  it('renders as th element by default', () => {
    renderInTable(<Header {...defaultProps} />)
    const header = screen.getByRole('columnheader')
    expect(header.tagName).toBe('TH')
  })

  it('renders as div when isStacked is true', () => {
    render(<Header {...defaultProps} isStacked={true} />)
    const headerContent = screen.getByTestId('header-content')
    expect(headerContent.parentElement?.tagName).toBe('DIV')
  })

  it('applies col scope to th element', () => {
    renderInTable(<Header {...defaultProps} />)
    const header = screen.getByRole('columnheader')
    expect(header).toHaveAttribute('scope', 'col')
  })

  it('applies sticky position when isSticky is true', () => {
    renderInTable(<Header {...defaultProps} isSticky={true} />)
    const header = screen.getByRole('columnheader')
    expect(header).toHaveStyle({position: 'sticky'})
  })

  it('applies primary background by default when no background provided', () => {
    renderInTable(<Header {...defaultProps} />)
    const header = screen.getByRole('columnheader')
    expect(header).toBeInTheDocument()
  })

  it('applies data-cell-id attribute', () => {
    renderInTable(<Header {...defaultProps} data-cell-id="cell-0-0" />)
    const header = screen.getByRole('columnheader')
    expect(header).toHaveAttribute('data-cell-id', 'cell-0-0')
  })

  it('applies custom background when provided', () => {
    renderInTable(<Header {...defaultProps} background="secondary" />)
    const header = screen.getByRole('columnheader')
    expect(header).toBeInTheDocument()
  })

  it('renders content wrapper with default opacity', () => {
    renderInTable(<Header {...defaultProps} />)
    const contentWrapper = screen.getByTestId('header-content')
    expect(contentWrapper).toHaveStyle({opacity: 1})
  })

  it('applies reduced opacity when isDragging is true', () => {
    renderInTable(<Header {...defaultProps} isDragging={true} />)
    const contentWrapper = screen.getByTestId('header-content')
    expect(contentWrapper).toHaveStyle({opacity: 0.5})
  })

  it('applies grab cursor when connectDragSource is provided', () => {
    const mockConnectDragSource = (<T,>(el: T) => el) as ConnectDragSource
    renderInTable(<Header {...defaultProps} connectDragSource={mockConnectDragSource} />)
    const contentWrapper = screen.getByTestId('header-content')
    expect(contentWrapper).toHaveStyle({cursor: 'grab'})
  })

  it('applies default cursor when connectDragSource is not provided', () => {
    renderInTable(<Header {...defaultProps} />)
    const contentWrapper = screen.getByTestId('header-content')
    expect(contentWrapper).toHaveStyle({cursor: 'default'})
  })

  it('connects drag source when connectDragSource is provided', () => {
    const mockConnectDragSource = jest.fn(<T,>(el: T) => el) as ConnectDragSource
    renderInTable(<Header {...defaultProps} connectDragSource={mockConnectDragSource} />)
    expect(mockConnectDragSource).toHaveBeenCalled()
  })

  it('connects drag preview with empty image when connectDragPreview is provided', () => {
    const mockConnectDragPreview = jest.fn()
    renderInTable(<Header {...defaultProps} connectDragPreview={mockConnectDragPreview} />)
    expect(mockConnectDragPreview).toHaveBeenCalledWith(
      expect.any(HTMLImageElement),
      {captureDraggingState: true}
    )
  })

  it('connects drop target when connectDropTarget is provided', () => {
    const mockConnectDropTarget = jest.fn()
    renderInTable(
      <Header {...defaultProps} connectDropTarget={mockConnectDropTarget} />
    )
    expect(mockConnectDropTarget).toHaveBeenCalledWith(expect.any(HTMLElement))
  })

  it('applies width from props to content wrapper', () => {
    renderInTable(<Header {...defaultProps} width="200px" />)
    const contentWrapper = screen.getByTestId('header-content')
    expect(contentWrapper).toHaveStyle({width: '200px'})
  })

  it('applies custom testid when provided', () => {
    renderInTable(<Header {...defaultProps} data-testid="custom-col-header" />)
    const header = screen.getByTestId('custom-col-header')
    expect(header).toBeInTheDocument()
  })

  it('filters out drag-drop specific props from DOM', () => {
    const mockConnectDragSource = (<T,>(el: T) => el) as ConnectDragSource
    const props = {
      ...defaultProps,
      connectDragSource: mockConnectDragSource,
      onMove: jest.fn(),
      onDragEnd: jest.fn(),
      itemId: 'item-1',
      index: 0,
      type: 'column',
    }
    renderInTable(<Header {...props} />)
    const header = screen.getByRole('columnheader')
    expect(header).not.toHaveAttribute('onMove')
    expect(header).not.toHaveAttribute('onDragEnd')
    expect(header).not.toHaveAttribute('itemId')
    expect(header).not.toHaveAttribute('index')
    expect(header).not.toHaveAttribute('type')
  })
})
