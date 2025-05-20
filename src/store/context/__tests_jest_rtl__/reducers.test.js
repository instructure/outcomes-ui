import { fromJS } from 'immutable'
import { expect, describe, it } from '@jest/globals'
import { SET_OUTCOMES, SET_SCORING_METHOD, SET_ROOT_OUTCOME_IDS, SET_CONTEXT } from '../../../constants'
import reducer from '../reducers'

describe('context/reducers', () => {
  const reduce = (state, type, payload) => reducer(state, { type, payload })

  const state = fromJS({
    contexts: {
      1: {
        loading: false,
        data: {
          id: 1,
          key: 'foo'
        }
      }
    },
    outcomes: {
      course_100: {
        10: { id: 10, label: 'foo', title: 'bar' },
        11: { id: 11, label: 'baz', title: 'bat' }
      }
    },
    rootOutcomeIds: {
      course_100: [1, 2, 3]
    }
  })

  describe('outcomes', () => {
    it('is merged with SET_OUTCOMES', () => {
      const newOutcomes = {
        course_100: {
          100: { id: 100, label: 'blue', title: 'green' },
          200: { id: 200, label: 'yellow', title: 'red' }
        }
      }
      const newState = reduce(state, SET_OUTCOMES, newOutcomes)
      expect(newState.getIn(['outcomes', 'course_100']).toJS()).toEqual(
        { ...state.toJS().outcomes.course_100, ...newOutcomes.course_100 }
      )
    })

    it('does not replace other context outcomes', () => {
      const newOutcomes = {
        course_101: [
          { id: 100, label: 'blue', title: 'green' },
          { id: 200, label: 'yellow', title: 'red' }
        ]
      }
      const newState = reduce(state, SET_OUTCOMES, newOutcomes)
      expect(Object.keys(newState.get('outcomes').toJS()).length).toBe(2)
    })

    it('sets the scoring method on SET_SCORING_METHOD', () => {
      const request = { context_uuid: 'course_100', id: 10, scoring_method: { points_possible: 5 } }
      const newState = reduce(state, SET_SCORING_METHOD, request)
      expect(newState.getIn(['outcomes', 'course_100', 10, 'scoring_method', 'points_possible'])).toBe(5)
    })
  })

  describe('rootOutcomeIds', () => {
    it('is replaced by SET_ROOT_OUTCOME_IDS', () => {
      const newState = reduce(state, SET_ROOT_OUTCOME_IDS, { course_100: [4, 5, 6] })
      expect(newState.get('rootOutcomeIds').toJS()).toEqual({ course_100: [4, 5, 6] })
    })

    it('does not replace other context root outcome ids', () => {
      const newState = reduce(state, SET_ROOT_OUTCOME_IDS, { course_101: [7, 8, 9] })
      expect(Object.keys(newState.get('rootOutcomeIds').toJS()).length).toBe(2)
    })
  })

  describe('contexts', () => {
    it('is replaced by SET_CONTEXT', () => {
      const newState = reduce(state, SET_CONTEXT, { 1: { loading: false, data: { id: 1, key: 'bar' } } })
      expect(newState.get('contexts').toJS()).toEqual({ 1: { loading: false, data: { id: 1, key: 'bar' } } })
    })

    it('does not replace other context', () => {
      const newState = reduce(state, SET_CONTEXT, { 2: { loading: false, data: { id: 2, key: 'bar' } } })
      expect(Object.keys(newState.get('contexts').toJS()).length).toBe(2)
    })
  })
})
