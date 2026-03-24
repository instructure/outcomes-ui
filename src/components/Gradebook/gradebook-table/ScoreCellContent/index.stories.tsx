import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View } from '@instructure/ui-view'
import { action } from '@storybook/addon-actions'
import { IconExpandStartLine } from '@instructure/ui-icons'
import { ScoreDisplayFormat } from '@/util/gradebook/constants'
import { ScoreCellContent } from './index'

const meta: Meta<typeof ScoreCellContent> = {
  title: 'Gradebook/ScoreCellContent',
  component: ScoreCellContent,
  parameters: {
    actions: { argTypesRegex: '' }, // Disable auto-actions
  },
  decorators: [
    (Story) => (
      <View width="200px" display="inline-block">
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ScoreCellContent>

export const IconOnly: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_ONLY,
    masteryLevel: 'exceeds_mastery',
    label: 'Exceeds Mastery',
    score: 4,
    background: 'secondary',
  },
}

export const IconAndScore: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_AND_POINTS,
    masteryLevel: 'mastery',
    label: 'Mastery',
    score: 3,
    background: 'secondary',
  },
}

export const IconAndLabel: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_AND_LABEL,
    masteryLevel: 'near_mastery',
    label: 'Near Mastery',
    score: 2,
    background: 'secondary',
  },
}

export const Percent: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.PERCENT,
    masteryLevel: 'mastery',
    label: 'Mastery',
    score: 3,
    totalScore: 4,
    background: 'secondary',
  },
}

export const PercentAndRatio: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.PERCENT_AND_RATIO,
    masteryLevel: 'mastery',
    label: 'Mastery',
    score: 3,
    totalScore: 4,
    background: 'secondary',
  },
}

export const OnAction: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_AND_POINTS,
    masteryLevel: 'remediation',
    label: 'Remediation',
    score: 1,
    onAction: action('onAction'),
    actionIcon: <IconExpandStartLine />,
    background: 'secondary',
  },
}

export const CustomColor: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_ONLY,
    masteryLevel: 'mastery',
    label: 'Mastery',
    score: 3,
    background: 'secondary',
    iconColor: '#FF6B35',
  },
}

export const CustomColorWithLabel: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_AND_LABEL,
    masteryLevel: 'exceeds_mastery',
    label: 'Exceeds Mastery',
    score: 4,
    background: 'secondary',
    iconColor: '#4CAF50',
  },
}

// Actual focus will be on table cell element, no focus ring shows here, only action button is displayed
export const FocusControlled: Story = {
  args: {
    scoreDisplayFormat: ScoreDisplayFormat.ICON_AND_POINTS,
    masteryLevel: 'no_evidence',
    label: 'No Evidence',
    score: 0,
    onAction: action('onAction'),
    actionIcon: <IconExpandStartLine />,
    focus: true,
    background: 'secondary',
  },
}
