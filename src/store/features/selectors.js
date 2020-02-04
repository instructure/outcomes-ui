import { createSelector } from 'reselect'

export const getFeatures = createSelector(
  (state) => state.getIn(['features']),
  (features) => features ? features.toJS() : []
)
