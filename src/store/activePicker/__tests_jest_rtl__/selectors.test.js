import { expect, describe, it } from '@jest/globals'
import { fromJS } from 'immutable'
import { getScope, isOpen } from '../selectors'

describe('activePicker/selectors', () => {
  const state = fromJS({
    activePicker: 'current_scope'
  })

  describe('getScope', () => {
    it('retrieves the current scope', () => {
      expect(getScope(state)).toBe('current_scope')
    })

    it('returns `` when empty', () => {
      const newState = state.setIn(['activePicker'], '')
      expect(getScope(newState)).toBe('')
    })
  })

  describe('isOpen', () => {
    it('returns true if the scope matches', () => {
      expect(isOpen(state, 'current_scope')).toBe(true)
    })

    it('returns false if the scope doesnt match', () => {
      expect(isOpen(state, '')).toBe(false)
    })
  })
})
