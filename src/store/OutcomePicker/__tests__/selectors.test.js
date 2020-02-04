import { expect } from 'chai'
import { Map, List, fromJS } from 'immutable'
import {
  getSelectedOutcomeIds,
  makeIsOutcomeSelected,
  anyOutcomeSelected,
  getActiveCollection,
  getActiveChildren,
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

  describe('makeIsOutcomeSelected', () => {
    it('returns true if outcome id is selected', () => {
      expect(makeIsOutcomeSelected(state, scope)('2')).to.be.true
    })

    it('returns false if outcome is not selected', () => {
      expect(makeIsOutcomeSelected(state, scope)('4')).to.be.false
    })

    it('returns false if no outcomes are selected', () => {
      const newState = Map()
      expect(makeIsOutcomeSelected(newState, scope)('1')).to.be.false
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

  describe('getActiveCollection', () => {
    it('returns correct values if there is no active collection', () => {
      const data = getActiveCollection(state, scope)
      expect(data.id).to.equal('')
      expect(data.header).to.equal('')
      expect(data.summary).to.equal('')
      expect(data.description).to.equal('')
    })

    it('returns the correct values if id if present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      const data = getActiveCollection(newState, scope)
      expect(data.id).to.equal(1)
      expect(data.header).to.equal('Some outcome 1')
      expect(data.summary).to.equal('1 Group | 1 Outcome')
      expect(data.description).to.equal('Description 1')
    })
  })

  describe('getActiveChildren', () => {
    it('returns an empty map when no set active', () => {
      expect(getActiveChildren(state, scope)).to.deep.equal({groups: [], nonGroups: []})
    })

    it('returns the list of groups and non groups when present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      const { groups, nonGroups } = getActiveChildren(newState, scope)
      expect(groups).to.deep.equal([
        {
          id: 2,
          title: 'Some outcome 2',
          description: 'Description 2',
          child_ids: ['4']
        }
      ])

      expect(nonGroups).to.deep.equal([
        {
          id: 3,
          title: 'Some outcome 3',
          description: 'Description 3',
          child_ids: []
        }
      ])
    })

    it('returns an empty map when no child ids are present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '4')
      expect(getActiveChildren(newState, scope)).to.deep.equal({groups: [], nonGroups: []})
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
