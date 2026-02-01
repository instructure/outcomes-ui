import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import OutcomeHeaderMenu from '.'
import type { OutcomeHeaderMenuProps } from '.'
import { IconButton } from '@instructure/ui-buttons'
import { IconMoreLine } from '@instructure/ui-icons'
import { SortOrder } from '@util/Gradebook/constants'

const OutcomeHeaderMenuContainer = (args: OutcomeHeaderMenuProps) => {
  const [sortOrder, setSortOrder] = useState(args.sortOrder)

  return (
    <OutcomeHeaderMenu
      {...args}
      sortOrder={sortOrder}
      onSortChange={(newSortOrder) => {
        setSortOrder(newSortOrder)
        args.onSortChange(newSortOrder)
      }}
    />
  )
}

const meta: Meta<OutcomeHeaderMenuProps> = {
  title: 'Gradebook/OutcomeHeaderMenu',
  component: OutcomeHeaderMenu,
  args: {
    sortOrder: undefined,
    trigger: (
      <IconButton screenReaderLabel="Outcome options">
        <IconMoreLine />
      </IconButton>
    ),
    onSortChange: () => {},
    onContributingScoresToggle: () => {},
    onShowOutcomeInfoClick: () => {},
    onShowOutcomeDistributionClick: () => {},
  },
  render: (args) => <OutcomeHeaderMenuContainer {...args} />,
}

export default meta
type Story = StoryObj<OutcomeHeaderMenuProps>

export const Default: Story = {
  args: {
    sortOrder: undefined,
  },
}

export const SortedAscending: Story = {
  args: {
    sortOrder: SortOrder.ASC,
  },
}

export const SortedDescending: Story = {
  args: {
    sortOrder: SortOrder.DESC,
  },
}

export const ContributingScoresHidden: Story = {
  args: {
    isContributingScoresVisible: false,
  },
}

export const ContributingScoresVisible: Story = {
  args: {
    isContributingScoresVisible: true,
  },
}
