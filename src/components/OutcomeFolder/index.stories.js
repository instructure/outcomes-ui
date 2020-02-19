import React from 'react'
import { object, text } from '@storybook/addon-knobs'
import { basicOutcome } from '../../../.storybook/constants'
import OutcomeFolder from './'

export default {
  title: 'OutcomeFolder'
}

export const standard = () => (
  <OutcomeFolder
    outcome={ object('Outcome', basicOutcome) }
    clickable={ true }
    getOutcomeSummary={ () => { return text('Summary', basicOutcome['description']) } }
    setActiveCollection={ () => {} }
    toggleExpandedIds={ () => {} }
    activeCollectionId='1'
  />
)
