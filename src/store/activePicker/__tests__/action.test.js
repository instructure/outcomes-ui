import { expect } from 'chai'
import {
  SET_SCOPE,
} from '../../../constants'
import * as actions from '../actions'

describe('activePicker/actions', () => {
  describe('setScope', () => {
    it ('creates an action', () => {
      const action = actions.setScope('scope_1')
      expect(action.type).to.equal(SET_SCOPE)
      expect(action.payload).to.deep.equal('scope_1')
    })
  })
})
