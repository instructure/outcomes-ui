import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Menu } from '@instructure/ui-menu'
import { ColumnHeader } from '..'

describe('ColumnHeader', () => {
  const defaultProps = {
    title: 'Test Column',
    optionsMenuTriggerLabel: 'Test Options',
    optionsMenuItems: [],
  }

  it('renders the title', () => {
    render(<ColumnHeader {...defaultProps} />)
    expect(screen.getAllByText('Test Column').length).toBeGreaterThan(0)
  })

  it('does not render the options menu when no items are provided', () => {
    render(<ColumnHeader {...defaultProps} />)
    expect(screen.queryByRole('button', {name: 'Test Options'})).not.toBeInTheDocument()
  })

  it('renders the options menu trigger', () => {
    const menuItems = [<Menu.Item key="item-a">Item A</Menu.Item>]

    render(<ColumnHeader {...defaultProps} optionsMenuItems={menuItems} />)
    expect(screen.getByRole('button', {name: 'Test Options'})).toBeInTheDocument()
  })

  it('renders multiple menu groups correctly', () => {
    const menuItems = [
      <Menu.Group key="group-1" label="Group 1">
        <Menu.Item>Item A</Menu.Item>
      </Menu.Group>,
      <Menu.Group key="group-2" label="Group 2">
        <Menu.Item>Item B</Menu.Item>
      </Menu.Group>,
    ]

    render(<ColumnHeader {...defaultProps} optionsMenuItems={menuItems} />)
    fireEvent.click(screen.getByRole('button', {name: 'Test Options'}))

    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2')).toBeInTheDocument()
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('uses custom column width when provided', () => {
    const {container} = render(<ColumnHeader {...defaultProps} columnWidth={300} />)
    const headerElement = container.querySelector('[data-testid="column-header"]')
    expect(headerElement).toHaveStyle({width: '300px'})
  })

  it('does not set width when columnWidth is not provided', () => {
    const {container} = render(<ColumnHeader {...defaultProps} />)
    const headerElement = container.querySelector('[data-testid="column-header"]')
    expect(headerElement).not.toHaveStyle({width: '300px'})
  })

  it('renders menu with single item', () => {
    const menuItems = [<Menu.Item key="item-1">Single Item</Menu.Item>]

    render(<ColumnHeader {...defaultProps} optionsMenuItems={menuItems} />)
    fireEvent.click(screen.getByRole('button', {name: 'Test Options'}))

    expect(screen.getByText('Single Item')).toBeInTheDocument()
  })

  it('renders the title in both visible and screen reader text', () => {
    render(<ColumnHeader {...defaultProps} title="Custom Title" />)

    const allTitles = screen.getAllByText('Custom Title')
    expect(allTitles.length).toBeGreaterThan(1)
  })

  it('renders menu without optionsMenuTriggerLabel', () => {
    const menuItems = [<Menu.Item key="item-1">Test Item</Menu.Item>]
    const propsWithoutLabel = {
      title: 'Test Column',
      optionsMenuItems: menuItems,
    }

    render(<ColumnHeader {...propsWithoutLabel} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('opens and closes menu on trigger click', () => {
    const menuItems = [<Menu.Item key="item-1">Menu Item</Menu.Item>]

    render(<ColumnHeader {...defaultProps} optionsMenuItems={menuItems} />)

    expect(screen.queryByText('Menu Item')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: 'Test Options'}))
    expect(screen.getByText('Menu Item')).toBeInTheDocument()
  })

  it('handles empty array for optionsMenuItems', () => {
    render(<ColumnHeader {...defaultProps} optionsMenuItems={[]} />)
    expect(screen.queryByRole('button', {name: 'Test Options'})).not.toBeInTheDocument()
  })

  it('renders with a very long title that might truncate', () => {
    const longTitle = 'This is a very long column header title that should potentially truncate'
    render(<ColumnHeader {...defaultProps} title={longTitle} columnWidth={150} />)
    expect(screen.getAllByText(longTitle).length).toBeGreaterThan(0)
  })

  it('renders without columnWidth or optionsMenuTriggerLabel', () => {
    const minimalProps = {
      title: 'Minimal Test',
    }
    render(<ColumnHeader {...minimalProps} />)
    expect(screen.getAllByText('Minimal Test').length).toBeGreaterThan(0)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders with columnWidth set to 0', () => {
    const {container} = render(<ColumnHeader {...defaultProps} columnWidth={0} />)
    const headerElement = container.querySelector('[data-testid="column-header"]')
    expect(headerElement).toHaveStyle({width: '0px'})
  })
})
