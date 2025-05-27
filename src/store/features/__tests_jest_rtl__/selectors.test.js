import { expect, describe, it } from '@jest/globals'
import { List, fromJS } from 'immutable'
import { getFeatures } from '../selectors'

describe ('context/selectors', () => {
  const state = fromJS({
    features: ['feature_1', 'feature_2']
  })

  describe('getFeatures', () => {
    it('retrieves the list of features', () => {
      expect(getFeatures(state)).toEqual(['feature_1', 'feature_2'])
    })

    it('returns [] when empty', () => {
      const newState = state.setIn(['features'], List())
      expect(getFeatures(newState)).toEqual([])
    })

    it('returns [] when unset', () => {
      const newState = state.deleteIn(['features'])
      expect(getFeatures(newState)).toEqual([])
    })
  })
})
