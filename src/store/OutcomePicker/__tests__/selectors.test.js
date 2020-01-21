import { expect } from 'chai'
import { Map, List, fromJS } from 'immutable'
import {
  getSelectedOutcomeIds,
  isOutcomeSelected,
  anyOutcomeSelected,
  getActiveCollectionId,
  getActiveOutcomeHeader,
  getActiveOutcomeSummary,
  getActiveOutcomeDescription,
  getActiveChildrenIds,
  getOutcomePickerState,
  getExpandedIds
} from '../selectors'

describe('OutcomePicker/selectors', () => {
  const scope = 'scopeForTest'
  const state = fromJS({
    scopeForTest: {
      config: {
        contextUuid: 'course_100'
      },
      OutcomePicker: {
        selected: ['1', '2', '3'],
        state: 'testing',
        expandedIds: ['1'],
        scope,
      },
    },
    context: {
      outcomes: {
        course_100: {
          1: {
            id: 1,
            title: 'Some outcome 1',
            description: 'Description 1',
            child_ids: ['2', '3']
          },
          2: {
            id: 2,
            title: 'Some outcome 2',
            description: 'Description 2',
            child_ids: ['4']
          },
          3: {
            id: 3,
            title: 'Some outcome 3',
            description: 'Description 3',
            child_ids: []
          },
          4: {
            id: 4,
            title: 'Some outcome 4',
            description: 'Description 4'
          }
        }
      }
    }
  })
  describe('getSelectedOutcomeIds', () => {
    it('retrieves the correct ids', () => {
      expect(getSelectedOutcomeIds(state, scope)).to.deep.equal(['1', '2', '3'])
    })

    it('returns an empty array if no outcomes are selected', () => {
      const newState = Map()
      expect(getSelectedOutcomeIds(newState, scope)).to.deep.equal([])
    })
  })

  describe('isOutcomeSelected', () => {
    it('returns true if outcome id is selected', () => {
      expect(isOutcomeSelected(state, scope, '2')).to.be.true
    })

    it('returns false if outcome is not selected', () => {
      expect(isOutcomeSelected(state, scope, '4')).to.be.false
    })

    it('returns false if no outcomes are selected', () => {
      const newState = Map()
      expect(isOutcomeSelected(newState, scope, '1')).to.be.false
    })
  })

  describe('anyOutcomeSelected', () => {
    it('returns true when outcomes are selected', () => {
      expect(anyOutcomeSelected(state, scope)).to.be.true
    })

    it('returns false if empty selected outcomes', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'selected'], new List())
      expect(anyOutcomeSelected(newState, scope)).to.be.false
    })

    it('returns false if no selected outcomes', () => {
      const newState = Map()
      expect(anyOutcomeSelected(newState)).to.be.false
    })
  })

  describe('getActiveCollectionId', () => {
    it('returns undefined if no active collection id', () => {
      expect(getActiveCollectionId(state, scope)).to.be.undefined
    })

    it('returns the active collection id if present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      expect(getActiveCollectionId(newState, scope)).to.equal('1')
    })
  })

  describe('getActiveOutcomeHeader', () => {
    it('returns no header if no active collection', () => {
      expect(getActiveOutcomeHeader(state, scope)).to.equal('')
    })

    it('returns header from active collection', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      expect(getActiveOutcomeHeader(newState, scope)).to.equal('Some outcome 1')
    })
  })

  describe('getActiveOutcomeSummary', () => {
    it('returns no summary if no active collection', () => {
      expect(getActiveOutcomeSummary(state, scope)).to.equal('')
    })

    it('returns summary from active collection', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      expect(getActiveOutcomeSummary(newState, scope)).to.equal('1 Group | 1 Outcome')
    })
  })

  describe('getActiveOutcomeDescription', () => {
    it('returns no description if no active collection', () => {
      expect(getActiveOutcomeDescription(state, scope)).to.equal('')
    })

    it('returns description from active collection', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      expect(getActiveOutcomeDescription(newState, scope)).to.equal('Description 1')
    })
  })

  describe('getActiveChildrenIds', () => {
    it('returns an empty array when no set active', () => {
      expect(getActiveChildrenIds(state, scope)).to.deep.equal([])
    })

    it('returns the set of ids when present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      expect(getActiveChildrenIds(newState, scope)).to.deep.equal(['2', '3'])
    })

    it('returns an empty array when no child ids are present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '4')
      expect(getActiveChildrenIds(newState, scope)).to.deep.equal([])
    })
  })

  describe('getOutcomePickerState', () => {
    it('retrieves the correct value', () => {
      expect(getOutcomePickerState(state, scope)).to.equal('testing')
    })
  })

  describe('getExpandedIds', () => {
    it('retrieves the correct value', () => {
      expect(getExpandedIds(state, scope)).to.deep.equal(['1'])
    })
  })
})
