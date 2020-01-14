export function getFeatures (state) {
  const features = state.getIn(['features'])
  return features ? features.toJS() : []
}
