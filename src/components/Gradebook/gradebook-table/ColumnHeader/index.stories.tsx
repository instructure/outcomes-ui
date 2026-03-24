import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Menu } from '@instructure/ui-menu'
import { IconStarLine } from '@instructure/ui-icons'
import { ColumnHeader } from '.'
import type { ColumnHeaderProps } from '.'

const meta: Meta<ColumnHeaderProps> = {
  title: 'Gradebook/ColumnHeader',
  component: ColumnHeader,
  args: {
    title: 'Column Title',
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

export const WithTitleId: Story = {
  args: {
    title: 'Test Title',
    titleId: 'test-title-id',
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

export const WithIcon: Story = {
  args: {
    title: 'Test Title',
    icon: <IconStarLine />,
  },
}

export const WithBrandBackground: Story = {
  args: {
    title: 'Test Title',
    background: 'brand',
    optionsMenuTriggerLabel: 'Test options',
    optionsMenuItems: menuItems,
  },
}

export const WithIconAndBackground: Story = {
  args: {
    title: 'Test Title',
    icon: <IconStarLine />,
    background: 'brand',
    optionsMenuTriggerLabel: 'Test options',
    optionsMenuItems: menuItems,
  },
}

export const TruncateWithoutTooltip: Story = {
  args: {
    title: 'This is a long title that should be truncated without showing a tooltip on hover',
    showTruncatedTooltip: false,
  },
}

export const TruncateWithTooltip: Story = {
  args: {
    title: 'This is a long title that should be truncated and show a tooltip on hover',
    showTruncatedTooltip: true,
  },
}
