import { expect } from 'chai'
import { List, fromJS } from 'immutable'
import {
  hasContextOutcomes,
  getOutcome,
  isOutcomeGroup,
  makeGetOutcomeSummary,
  getRootOutcomeIds,
  getCollectionData,
  getDescriptor,
  getChildrenToLoad,
  hasRootOutcomes,
  getContext,
  getContextByScope
} from '../selectors'

describe('context/selectors', () => {
  const scope = 'scopeForTest'

  const state = fromJS({
    scopeForTest: {
      config: {
        contextUuid: 'course_100'
      }
    },
    context: {
      outcomes: {
        course_100: {
          1: { id: 1, label: 'l1', title: 't1', child_ids: ['2', '3'] },
          2: { id: 2, label: 'l2', title: 't2', child_ids: ['4'] },
          3: { id: 3, label: 'l3', title: 't3', child_ids: [] },
          4: { id: 4, label: 'l4', title: 't4' }
        },
        selectedSharedContext: {
          5: { id: 5, label: 'l5', title: 't5' }
        }
      },
      contexts: {
        course_100: {
          loading: false,
          data: {
            id: 1
          }
        }
      },
      rootOutcomeIds: {
        course_100: [1]
      }
    }
  })

  const stateWithSelectedSharedContext = state.merge({
    scopeForTest: {
      OutcomePicker: {
        selectedSharedContext: {uuid: 'selectedSharedContext', name: 'selectedSharedContext'}
      }
    }
  })

  describe('getContext', () => {
    it('returns context when outcomes exist', () => {
      expect(getContext(state, 'course_100').data.id).to.be.equal(1)
    })

    it('returns undefined when does not exists', () => {
      expect(getContext(state, 'course_101')).to.be.undefined
    })
  })

  describe('getContextByScope', () => {
    it('returns context when outcomes exist', () => {
      expect(getContextByScope(state, scope).data.id).to.be.equal(1)
    })

    it('returns undefined when does not exists', () => {
      expect(getContextByScope(state, 'any_scope')).to.be.undefined
    })
  })

  describe('hasContextOutcomes', () => {
    it('returns true when outcomes exist', () => {
      expect(hasContextOutcomes(state, scope)).to.equal(true)
    })

    it('returns false when empty', () => {
      const newState = state.setIn(['context', 'outcomes'], List())
      expect(hasContextOutcomes(newState, scope)).to.equal(false)
    })

    it('returns false when unset', () => {
      const newState = state.deleteIn(['context', 'outcomes'])
      expect(hasContextOutcomes(newState, scope)).to.equal(false)
    })
  })

  describe('hasRootOutcomes', () => {
    it('returns true when outcomes exist', () => {
      expect(hasRootOutcomes(state, scope)).to.equal(true)
    })

    it('returns false when empty', () => {
      const newState = state.setIn(['context', 'rootOutcomeIds', 'course_100'], List())
      expect(hasRootOutcomes(newState, scope)).to.equal(false)
    })

    it('returns false when unset', () => {
      const newState = state.deleteIn(['context', 'rootOutcomeIds'])
      expect(hasRootOutcomes(newState, scope)).to.equal(false)
    })
  })

  describe('getOutcome', () => {
    it('retrieves the correct value', () => {
      expect(getOutcome(state, scope, '3')).to.have.property('id', 3)
    })

    it('returns null if not present', () => {
      expect(getOutcome(state, scope, '10')).to.be.null
    })

    it('returns null if not present in the selected shared context', () => {
      expect(getOutcome(stateWithSelectedSharedContext, scope, '3')).to.be.null
    })

    it('retrieves the correct value from the selected shared context', () => {
      expect(getOutcome(stateWithSelectedSharedContext, scope, '5')).to.have.property('id', 5)
    })

  })

  describe('getRootOutcomeIds', () => {
    it('retrieves the correct value', () => {
      expect(getRootOutcomeIds(state, scope)).to.deep.equal([1])
    })

    it('returns [] if not present', () => {
      const newState = state.deleteIn(['context', 'rootOutcomeIds', 'course_100'])
      expect(getRootOutcomeIds(newState, scope)).to.deep.equal([])
    })
  })

  describe('isOutcomeGroup', () => {
    it('returns true for outcome groups', () => {
      expect(isOutcomeGroup(state, scope, '1')).to.be.ok
    })

    it('returns false if not present', () => {
      expect(isOutcomeGroup(state, scope, '5')).to.not.be.ok
    })

    it('returns false for non-outcome groups', () => {
      expect(isOutcomeGroup(state, scope, '3')).to.not.be.ok
      expect(isOutcomeGroup(state, scope, '4')).to.not.be.ok
    })
  })

  describe('makeGetOutcomeSummary', () => {
    it('returns the correct summary', () => {
      expect(makeGetOutcomeSummary(state, scope)('1')).to.equal('1 Group | 1 Outcome')
    })
  })

  describe('getCollectionData', () => {
    it('returns collections', () => {
      const collections = getCollectionData(state, scope)
      expect(collections).to.be.present
      expect(Object.keys(collections).length).to.equal(2)
    })

    it('returns proper collection and subCollection data', () => {
      const collections = getCollectionData(state, scope)
      const subCollectionId = collections['1'].collections[0]
      expect(collections['1'].name).to.equal('t1')
      expect(collections[subCollectionId].name).to.equal('t2')
    })

    it('caches its result', () => {
      const collections = getCollectionData(state, scope)
      const collections2 = getCollectionData(state, scope)
      expect(collections).to.equal(collections2)
    })

    it('updates its cache if the outcomes change', () => {
      const collections = getCollectionData(state, scope)
      const newState = state.deleteIn(['context', 'outcomes', 'course_100', '4'])
      const collections2 = getCollectionData(newState, scope)
      expect(collections).not.to.equal(collections2)
    })
  })

  describe('getDescriptor', () => {
    describe('with groups and outcomes', () => {
      it('returns a properly formatted string', () => {
        expect(getDescriptor(2, 3)).to.equal('2 Groups | 3 Outcomes')
      })
    })

    describe('with only groups', () => {
      it('returns a properly formatted string', () => {
        expect(getDescriptor(1, 0)).to.equal('1 Group')
      })
    })

    describe('with only outcomes', () => {
      it('returns a properly formatted string', () => {
        expect(getDescriptor(0, 1)).to.equal('1 Outcome')
      })
    })

    describe('with no groups or outcomes', () => {
      it('returns a properly formatted string', () => {
        expect(getDescriptor(0, 0)).to.equal('')
      })
    })
  })

  describe('getChildrenToLoad', () => {
    const partialState = state.setIn(['context', 'outcomes', 'course_100'], fromJS({
      5: { id: 5, label: 'l5', title: 't5', has_children: true, child_ids: ['6', '7', '8'] },
      6: { id: 6, label: 'l6', title: 't6', has_children: true, is_partial: true },
      7: { id: 7, label: 'l7', title: 't7', has_children: false, is_partial: true },
      8: { id: 8, label: 'l8', title: 't8', has_children: true },
      9: { id: 9, label: 'l9', title: 't9' }
    }))

    it('returns an empty array if using the old state', () => {
      ['1', '2', '3', '4'].forEach((id) => {
        expect(getChildrenToLoad(state, scope, id)).to.deep.equal([])
      })
    })

    it('returns the given id if the outcome is not in state', () => {
      const newState = partialState.deleteIn(['context', 'outcomes', 'course_100', '5'])
      expect(getChildrenToLoad(newState, scope, '5')).to.deep.equal(['5'])
    })

    it('returns the given id if the outcome is not fully loaded', () => {
      const newState = partialState.setIn(['context', 'outcomes', 'course_100', '5', 'is_partial'], true)
      expect(getChildrenToLoad(newState, scope, '5')).to.deep.equal(['5'])
    })

    it('returns the child ids which are groups and which are not fully loaded', () => {
      expect(getChildrenToLoad(partialState, scope, '5')).to.deep.equal(['6'])
    })

    it('returns an empty array if the outcome is not a group', () => {
      expect(getChildrenToLoad(partialState, scope, '9')).to.deep.equal([])
    })
  })
})
