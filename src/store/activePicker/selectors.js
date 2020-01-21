function restrict(state) {
  return state.getIn(['activePicker']) || ''
}

export function isOpen (state, scope) {
  return restrict(state) === scope
}

export function getScope (state) {
  return restrict(state)
}
