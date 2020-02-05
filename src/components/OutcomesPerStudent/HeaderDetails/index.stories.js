import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { outcomeRollup } from '../../../../.storybook/constants'
import HeaderDetails from './'

export default {
  title: 'OutcomesPerStudent HeaderDetails'
}

export const standard = () => (
  <HeaderDetails
    outcomeResult={ object('Result Summary', outcomeRollup) }
    showRollups={ boolean('Show Rollups', true) }
  />
)
