import React from 'react'
import { object, array } from '@storybook/addon-knobs'
import { defaultCollections } from '../../../.storybook/constants'

import OutcomeTree from './'

export default {
  title: 'OutcomeTree'
}

export const collapsed = () => (
  <div style={ { height: '100vh' } }>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ [] }
      toggleExpandedIds={ () => {} }
    />
  </div>
)

export const oneLevelExpanded = () => (
  <div style={ { height: '100vh' } }>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ array('Expanded Group Ids', [1]) }
      toggleExpandedIds={ () => {} }
    />
  </div>
)

export const twoLevelExpanded = () => (
  <div style={ { height: '100vh' } }>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ array('Expanded Group Ids', [1,4]) }
      toggleExpandedIds={ () => {} }
    />
  </div>
)
