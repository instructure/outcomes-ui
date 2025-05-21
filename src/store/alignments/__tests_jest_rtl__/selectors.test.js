import { expect, describe, it } from '@jest/globals'
import { Map, fromJS } from 'immutable'
import {
  getAlignedOutcomeIds,
  getAlignedOutcomes,
  getAlignedOutcome,
  getAlignedOutcomeCount,
  getAnyOutcome,
  makeIsOpen,
  getLaunchContextUuid, getRootAccountContextUuid, isLaunchingFromRootAccount
} from '../selectors'

describe('alignments/selectors', () => {
  const state = fromJS({
    scopeForTest: {
      alignments: {
        alignedOutcomes: [
          { id: '102', label: 'l2', title: 't1' },
          { id: '101', label: 'l1', title: 't2' },
          { id: '103', label: 'l3', title: 't3' }
        ],
        openAlignmentId: 12
      }
    }
  })

  describe('getAlignedOutcomeIds', () => {
    it('retrieves the correct value', () => {
      expect(getAlignedOutcomeIds(state, 'scopeForTest')).toEqual(['102', '101', '103'])
    })

    it('returns [] when not set', () => {
      const newState = Map()
      expect(getAlignedOutcomeIds(newState, 'scopeForTest')).toEqual([])
    })
  })

  describe('getAlignedOutcomes', () => {
    it('retrieves the outcomes for each aligned outcome id', () => {
      const outcomes = getAlignedOutcomes(state, 'scopeForTest')
      expect(outcomes).toHaveLength(3)
      expect(outcomes).toEqual([
        { id: '102', label: 'l2', title: 't1' },
        { id: '101', label: 'l1', title: 't2' },
        { id: '103', label: 'l3', title: 't3' }
      ])
    })

    it('memoizes alignedOutcomes by scope', () => {
      getAlignedOutcomes.resetRecomputations()
      getAlignedOutcomes.clearCache()
      getAlignedOutcomes(state, 'scopeForTest')
      getAlignedOutcomes(Map(), 'newScope')
      getAlignedOutcomes(state, 'scopeForTest')
      expect(getAlignedOutcomes.recomputations()).toBe(2)
    })
  })

  describe('getAlignedOutcomeCount', () => {
    it('returns the count when the list of outcomes is defined', () => {
      const count = getAlignedOutcomeCount(state, 'scopeForTest')
      expect(count).toBe(3)
    })

    it('returns 0 when the list is not defined', () => {
      const count = getAlignedOutcomeCount(state, 'anotherScope')
      expect(count).toBe(0)
    })

    it('does not count hidden outcomes', () => {
      const newState = fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [
              { id: '102', label: 'l2', title: 't1', decorator: 'HIDE' },
              { id: '101', label: 'l1', title: 't2' },
              { id: '103', label: 'l3', title: 't3' }
            ]
          }
        }
      })
      const count = getAlignedOutcomeCount(newState, 'scopeForTest')
      expect(count).toBe(2)
    })
  })

  describe('makeIsOpen', () => {
    it('returns true if alignment id is openAlignmentId', () => {
      expect(makeIsOpen(state, 'scopeForTest')(12)).toBe(true)
    })

    it('returns false if another alignment id is openAlignmentId', () => {
      expect(makeIsOpen(state, 'scopeForTest')(13)).toBe(false)
    })

    it('returns false if no alignment is openAlignmentId', () => {
      const newState = Map()
      expect(makeIsOpen(newState, 'scopeForTest')(12)).toBe(false)
    })
  })

  describe('getAlignedOutcome', () => {
    it('retrieves an aligned outcome by its id', () => {
      const outcome = getAlignedOutcome(state, 'scopeForTest', '101')
      expect(outcome).toEqual({ id: '101', label: 'l1', title: 't2' })
    })
  })

  describe('getAnyOutcome', () => {
    it('can pull outcomes from aligned outcomes', () => {
      const outcome = getAnyOutcome(state, 'scopeForTest', '101')
      expect(outcome.label).toBe('l1')
    })

    it('can pull outcomes from context outcomes', () => {
      const state = fromJS({
        scopeForTest: {
          config: {
            contextUuid: 'course_100'
          }
        },
        context: {
          outcomes: {
            course_100: {
              1: { id: 1, label: 'l1', title: 't1', child_ids: ['2', '3'] }
            }
          }
        }
      })
      const outcome = getAnyOutcome(state, 'scopeForTest', '1')
      expect(outcome.label).toBe('l1')
    })

    it('can pull outcomes from launchContext outcomes', () => {
      const state = fromJS({
        scopeForTest: {
          config: {
            contextUuid: 'course_100'
          },
          alignments: {
            launchContexts: [
              {uuid: 'launchContext', name: 'LaunchContext'}
            ]
          }
        },
        context: {
          outcomes: {
            course_100: {
              1: { id: 1, label: 'l1', title: 't1', child_ids: ['2', '3'] }
            },
            launchContext: {
              4: { id: 4, label: 'l4', title: 't4', child_ids: ['5', '6'] }
            }
          }
        }
      })
      const outcome = getAnyOutcome(state, 'scopeForTest', '4')
      expect(outcome.label).toBe('l4')
    })

    it('returns null if neither present', () => {
      const state = Map()
      const outcome = getAnyOutcome(state, 'scopeForTest', '101')
      expect(outcome).toBeNull()
    })
  })
  describe('launchContexts', () => {
    const scope = 'scopeForTest'
    function setLaunchContexts(state, launchContexts) {
      return state.setIn([scope, 'alignments', 'launchContexts'], fromJS(launchContexts))
    }

    it('is null if launchContexts is null', () => {
      expect(getLaunchContextUuid(state, scope)).toEqual(null)
    })

    it('is null if launchContexts is empty', () => {
      const launchContexts = []
      const newState = setLaunchContexts(state, launchContexts)
      expect(getLaunchContextUuid(newState, scope)).toEqual(null)
    })

    it('is only element if launchContexts has one element', () => {
      const launchContexts = [{uuid: 'foo', name: 'bar'}]
      const newState = setLaunchContexts(state, launchContexts)
      expect(getLaunchContextUuid(newState, scope)).toEqual('foo')
      expect(getRootAccountContextUuid(newState, scope)).toEqual('foo')
      expect(isLaunchingFromRootAccount(newState, scope)).toBe(true)
    })

    it('is last if launchContexts has multiple entries', () => {
      const launchContexts = [{uuid: 'foo', name: 'bar'}, {uuid: 'fuz', name: 'baz'}]
      const newState = setLaunchContexts(state, launchContexts)
      expect(getLaunchContextUuid(newState, scope)).toEqual('fuz')
      expect(getRootAccountContextUuid(newState, scope)).toEqual('foo')
      expect(isLaunchingFromRootAccount(newState, scope)).toBe(false)
    })
  })
})
