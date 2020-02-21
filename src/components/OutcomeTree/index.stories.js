import React from 'react'
import { object, array } from '@storybook/addon-knobs'
import { defaultCollections } from '../../../.storybook/constants'
import { View } from '@instructure/ui-view'
import OutcomeTree from './'

export default {
  title: 'OutcomeTree'
}

export const collapsed = () => (
  <View as='div' height='100vh'>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ [] }
      toggleExpandedIds={ () => {} }
    />
  </View>
)

export const oneLevelExpanded = () => (
  <View as='div' height='100vh'>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ array('Expanded Group Ids', [1]) }
      toggleExpandedIds={ () => {} }
    />
  </View>
)

export const twoLevelExpanded = () => (
  <View as='div' height='100vh'>
    <OutcomeTree
      collections={ object('Collections', defaultCollections) }
      setActiveCollection={ () => {} }
      rootOutcomeIds={ [1,2,3] }
      expandedIds={ array('Expanded Group Ids', [1,4]) }
      toggleExpandedIds={ () => {} }
    />
  </View>
)
