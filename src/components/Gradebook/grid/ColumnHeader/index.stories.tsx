import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ColumnHeader } from '.'
import type { ColumnHeaderProps } from '.'
import { Menu } from '@instructure/ui-menu'

const meta: Meta<ColumnHeaderProps> = {
  title: 'Gradebook/ColumnHeader',
  component: ColumnHeader,
  args: {
    title: 'Outcome Title',
    optionsMenuTriggerLabel: 'Options',
  },
}

export default meta
type Story = StoryObj<ColumnHeaderProps>

const menuItems = [
  <Menu.Group label="Group 1" key="group-1">
    <Menu.Item>
      Option 1
    </Menu.Item>

    <Menu.Item>
      Option 2
    </Menu.Item>
  </Menu.Group>
]

export const Default: Story = {
  args: {
    title: 'Test Title',
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a long title that should be truncated with an ellipsis when it exceeds the available space',
  },
}

export const WithMenu: Story = {
  args: {
    title: 'Test Title',
    optionsMenuTriggerLabel: 'Test options',
    optionsMenuItems: menuItems,
  },
}

export const LongTitleWithMenu: Story = {
  args: {
    title: 'This is a very long title that should be truncated with an ellipsis when it exceeds the available space',
    optionsMenuTriggerLabel: 'Test options',
    optionsMenuItems: menuItems,
  },
}

export const CustomWidth: Story = {
  args: {
    title: 'Custom Width',
    columnWidth: 300,
  },
}

export const NarrowColumn: Story = {
  args: {
    title: 'Narrow Column Title',
    columnWidth: 150,
  },
}
