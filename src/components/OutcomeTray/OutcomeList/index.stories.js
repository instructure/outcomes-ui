import React from 'react'
import { object, number, boolean } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../../.storybook/constants'
import OutcomeList from './'

export default {
  title: 'OutcomeList'
}

export const Paginated = () => (
  <OutcomeList
    outcomes={ object('Outcomes', defaultOutcomes()) }
    isLoading={ boolean('Is Loading', false) }
    listPage={ number('Page Index', 1) }
    listTotal={ number('Total Outcomes', 987) }
    setFocusedOutcome={ () => {} }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds={ () => {} }
/>
)
