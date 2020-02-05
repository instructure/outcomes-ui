import React from 'react'
import { object, array } from '@storybook/addon-knobs'
import { defaultCollections } from '../../../.storybook/constants'

import OutcomeTree from './'

export default {
  title: 'OutcomeTree'
}

export const collapsed = () => (
  <OutcomeTree
    collections={ object('Collections', defaultCollections) }
    setActiveCollection={ () => {} }
    rootOutcomeIds={ [1,2,3] }
    expandedIds={ [] }
    toggleExpandedIds={ () => {} }
  />
)

export const oneLevelExpanded = () => (
  <OutcomeTree
    collections={ object('Collections', defaultCollections) }
    setActiveCollection={ () => {} }
    rootOutcomeIds={ [1,2,3] }
    expandedIds={ array('Expanded Group Ids', [1]) }
    toggleExpandedIds={ () => {} }
  />
)

export const twoLevelExpanded = () => (
  <OutcomeTree
    collections={ object('Collections', defaultCollections) }
    setActiveCollection={ () => {} }
    rootOutcomeIds={ [1,2,3] }
    expandedIds={ array('Expanded Group Ids', [1,4]) }
    toggleExpandedIds={ () => {} }
  />
)
