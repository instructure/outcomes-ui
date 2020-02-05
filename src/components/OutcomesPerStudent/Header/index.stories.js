import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { basicOutcome, outcomeRollup } from '../../../../.storybook/constants'
import Header from './'

export default {
  title: 'OutcomesPerStudent Header'
}

export const standard = () => (
  <Header
    outcomeResult={ object('Result Summary', outcomeRollup) }
    getReportOutcome={ () => object('Outcome', basicOutcome) }
    viewReportAlignment={ () => {} }
    isOpen={ boolean('Is Open', false) }
    closeReportAlignment={ () => {} }
    showRollups={ boolean('Show Rollups', true) }
  />
)
