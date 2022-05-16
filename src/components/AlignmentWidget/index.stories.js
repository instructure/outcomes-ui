import React from 'react'
import { object } from '@storybook/addon-knobs'
import AlignmentWidget from '.'
import { defaultOutcomes } from '../../../.storybook/constants'

export default {
  title: 'AlignmentWidget'
}

const defaultProps = {
  openOutcomePicker: () => {},
  removeAlignment: () => {},
  tray: () => (<div><br/>Tray would render on click</div>), // eslint-disable-line react/display-name
  scope: ''
}

export const alignedOutcomes = () => (
  <AlignmentWidget
    alignedOutcomes={ object('Outcomes', defaultOutcomes()) }
    {...defaultProps}
  />
)

export const noAlignedOutcomes = () => (
  <AlignmentWidget
    alignedOutcomes={ [] }
    {...defaultProps}
  />
)
