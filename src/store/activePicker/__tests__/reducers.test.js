import { expect } from 'chai'
import {
  SET_SCOPE
} from '../../../constants'
import reducer from '../reducers'

describe('activePicker/reducers', () => {
  const state = 'begin_scope'

  const reduce = (state, type, payload) => reducer(state, { type, payload })

  it('SET_SCOPE updates the scope', () => {
    const scope = 'current_scope'
    const newState = reduce(state, SET_SCOPE, scope)
    expect(newState).to.deep.equal('current_scope')
  })

})
