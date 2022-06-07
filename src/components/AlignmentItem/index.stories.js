import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { outcomeViewWithResults } from '../../../.storybook/constants'
import AlignmentItem from './'

export default {
  title: 'AlignmentItem'
}

const noOp = () => {}

export const alignment = () => (
  <AlignmentItem
    outcome={ object('Outcome', outcomeViewWithResults) }
    removeAlignment={noOp}
    isTray={boolean('Render in Outcome Tray?', false)}
    canManageOutcomes={boolean('User can manage outcomes', true)}
    setFocusedOutcome={noOp}
    isOutcomeSelected={noOp}
    selectOutcomeIds={noOp}
    deselectOutcomeIds= {noOp}
  />
)
