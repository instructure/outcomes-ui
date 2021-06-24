import React from 'react'
import PropTypes from 'prop-types'

import { View } from '@instructure/ui-view'
import { TreeBrowser } from '@instructure/ui-tree-browser'

const OutcomeBrowser = (props) => {
  if (!props.collections) {
    return null
  }
  const {
    collections,
    setActiveCollection,
    rootOutcomeIds,
    expandedIds,
    toggleExpandedIds
  } = props

  const handleSelect = (id) => {
    setActiveCollection(id)
    toggleExpandedIds({ id })
  }

  const defaultExpanded = rootOutcomeIds.length === 1 ? rootOutcomeIds : []

  const renderRootLevel = () => {
    let showRoot = false
    rootOutcomeIds.forEach((id) => {
      if (!collections[id]) {
        showRoot = true
      }
    })
    return showRoot
  }

  return (
    <View as="div" margin="xx-small">
      <TreeBrowser
        collections={collections}
        rootId={rootOutcomeIds.length > 0 ? 'root' : void 0}
        showRootCollection={renderRootLevel()}
        items={{}}
        onCollectionClick={handleSelect}
        expanded={[...defaultExpanded, ...expandedIds]}
      />
    </View>
  )
}

// eslint-disable-next-line immutable/no-mutation
OutcomeBrowser.propTypes = {
  collections: PropTypes.object.isRequired,
  setActiveCollection: PropTypes.func.isRequired,
  rootOutcomeIds: PropTypes.array.isRequired,
  expandedIds: PropTypes.array.isRequired,
  toggleExpandedIds: PropTypes.func.isRequired
}

export default OutcomeBrowser
