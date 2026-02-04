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
})
