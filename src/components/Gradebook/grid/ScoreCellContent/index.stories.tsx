import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ScoreCellContent } from './index'
import { ScoreDisplayFormat } from '@/util/gradebook/constants'
import { View } from '@instructure/ui-view'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof ScoreCellContent> = {
  title: 'Gradebook/ScoreCellContent',
  component: ScoreCellContent,
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
  render: () => (
    <ScoreCellContent
      scoreDisplayFormat={ScoreDisplayFormat.ICON_ONLY}
      masteryLevel="exceeds_mastery"
      label="Exceeds Mastery"
      score={4} />
  ),
}

export const IconAndScore: Story = {
  render: () => (
    <ScoreCellContent
      scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_POINTS}
      masteryLevel="mastery"
      label="Mastery"
      score={3} />
  ),
}

export const IconAndLabel: Story = {
  render: () => (
    <ScoreCellContent
      scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_LABEL}
      masteryLevel="near_mastery"
      label="Near Mastery"
      score={2} />
  ),
}

export const OnAction: Story = {
  render: () => (
    <ScoreCellContent
      scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_POINTS}
      masteryLevel="remediation"
      label="Remediation"
      score={1}
      onAction={action('onAction')} />
  ),
}

// Actual focus will be on table cell element, no focus ring shows here, only action button is displayed
export const FocusControlled: Story = {
  render: () => (
    <ScoreCellContent
      scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_POINTS}
      masteryLevel="no_evidence"
      label="No Evidence"
      score={0}
      onAction={action('onAction')}
      focus={true} />
  ),
}
