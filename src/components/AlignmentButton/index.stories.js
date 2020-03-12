import React from 'react'
import { object } from '@storybook/addon-knobs'
import AlignmentButton from './'
import { defaultOutcomes } from '../../../.storybook/constants'

export default {
  title: 'AlignmentButton'
}

const defaultProps = {
  openOutcomePicker: () => {},
  removeAlignment: () => {},
  tray: () => (<div><br/>Tray would render on click</div>), // eslint-disable-line react/display-name
  scope: ''
}

export const alignedOutcomes = () => (
  <AlignmentButton
    alignedOutcomes={ object('Outcomes', defaultOutcomes()) }
    {...defaultProps}
  />
)

export const noAlignedOutcomes = () => (
  <AlignmentButton
    alignedOutcomes={ [] }
    {...defaultProps}
  />
)
