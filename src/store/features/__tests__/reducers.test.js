import { expect, describe, it } from '@jest/globals'
import { SET_FEATURES } from '../../../constants'
import reducer from '../reducers'

describe('features/reducers', () => {
  const state = []

  const reduce = (state, type, payload) => reducer(state, { type, payload })

  describe('features', () => {
    it('updates features list', () => {
      const features = ['feature_1', 'feature_2']
      const newState = reduce(state, SET_FEATURES, features)
      expect(newState.toJS()).toEqual(['feature_1', 'feature_2'])
    })
  })
})
