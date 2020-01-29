import { expect } from 'chai'
import { Map, fromJS } from 'immutable'
import {
  getAlignedOutcomeIds,
  getAlignedOutcomes,
  getAlignedOutcome,
  getAlignedOutcomeCount,
  getAnyOutcome,
  makeIsOpen
} from '../selectors'

describe('alignments/selectors', () => {
  const state = fromJS({
    scopeForTest: {
      alignments: {
        alignedOutcomes: [
          { id: '101', label: 'l1', title: 't2' },
          { id: '102', label: 'l2', title: 't1' },
          { id: '103', label: 'l3', title: 't3' }
        ],
        openAlignmentId: 12
      }
    }
  })

  describe('getAlignedOutcomeIds', () => {
    it('retrieves the correct value', () => {
      expect(getAlignedOutcomeIds(state, 'scopeForTest')).to.deep.equal(['102', '101', '103'])
    })

    it('returns [] when not set', () => {
      const newState = Map()
      expect(getAlignedOutcomeIds(newState, 'scopeForTest')).to.deep.equal([])
    })
  })

  describe('getAlignedOutcomes', () => {
    it('retrieves the outcomes for each aligned outcome id', () => {
      const outcomes = getAlignedOutcomes(state, 'scopeForTest')
      expect(outcomes).to.have.length(3)
      expect(outcomes).to.deep.equal([
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
      expect(getAlignedOutcomes.recomputations()).to.equal(2)
    })
  })

  describe('getAlignedOutcomeCount', () => {
    it('returns the count when the list of outcomes is defined', () => {
      const count = getAlignedOutcomeCount(state, 'scopeForTest')
      expect(count).to.equal(3)
    })

    it('returns 0 when the list is not defined', () => {
      const count = getAlignedOutcomeCount(state, 'anotherScope')
      expect(count).to.equal(0)
    })
  })

  describe('makeIsOpen', () => {
    it('returns true if alignment id is openAlignmentId', () => {
      expect(makeIsOpen(state, 'scopeForTest')(12)).to.be.true
    })

    it('returns false if another alignment id is openAlignmentId', () => {
      expect(makeIsOpen(state, 'scopeForTest')(13)).to.be.false
    })

    it('returns false if no alignment is openAlignmentId', () => {
      const newState = Map()
      expect(makeIsOpen(newState, 'scopeForTest')(12)).to.be.false
    })
  })

  describe('getAlignedOutcome', () => {
    it('retrieves an aligned outcome by its id', () => {
      const outcome = getAlignedOutcome(state, 'scopeForTest', '101')
      expect(outcome).to.deep.equal({ id: '101', label: 'l1', title: 't2' })
    })
  })

  describe('getAnyOutcome', () => {
    it('can pull outcomes from aligned outcomes', () => {
      const outcome = getAnyOutcome(state, 'scopeForTest', '101')
      expect(outcome.label).to.equal('l1')
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
      expect(outcome.label).to.equal('l1')
    })

    it('returns null if neither present', () => {
      const state = Map()
      const outcome = getAnyOutcome(state, 'scopeForTest', '101')
      expect(outcome).to.be.null
    })
  })
})
