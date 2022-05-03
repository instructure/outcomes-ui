import React from 'react'
import { object } from '@storybook/addon-knobs'
import { basicOutcome } from '../../../.storybook/constants'
import AlignmentItem from './'

export default {
  title: 'AlignmentItem'
}

const noOp = () => {}

export const alignment = () => (
  <AlignmentItem
    outcome={ object('Outcome', basicOutcome) }
    removeAlignment={noOp}
    readOnly={false}
    isTray={false}
    setFocusedOutcome={noOp}
    isOutcomeSelected={noOp}
    selectOutcomeIds={noOp}
    deselectOutcomeIds= {noOp}
  />
)

export const readOnlyAlignment = () => (
  <AlignmentItem
    outcome={ object('Outcome', basicOutcome) }
    removeAlignment={noOp}
    readOnly={true}
    isTray={false}
    setFocusedOutcome={noOp}
    isOutcomeSelected={noOp}
    selectOutcomeIds={noOp}
    deselectOutcomeIds= {noOp}
  />
)

export const outcome = () => (
  <AlignmentItem
    outcome={ object('Outcome', basicOutcome) }
    removeAlignment={noOp}
    readOnly={false}
    isTray={true}
    setFocusedOutcome={noOp}
    isOutcomeSelected={noOp}
    selectOutcomeIds={noOp}
    deselectOutcomeIds= {noOp}
  />
)
