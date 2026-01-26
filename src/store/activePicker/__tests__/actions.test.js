import { expect, describe, it } from '@jest/globals'
import {
  SET_SCOPE,
} from '../../../constants'
import * as actions from '../actions'

describe('activePicker/actions', () => {
  describe('setScope', () => {
    it('creates an action', () => {
      const action = actions.setScope('scope_1')
      expect(action.type).toBe(SET_SCOPE)
      expect(action.payload).toEqual('scope_1')
    })
  })
})
