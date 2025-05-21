import { expect, describe, it } from '@jest/globals'
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
      expect(getSelectedOutcomeIds(state, scope)).toEqual(['1', '2', '3'])
    })

    it('returns an empty array if no outcomes are selected', () => {
      const newState = Map()
      expect(getSelectedOutcomeIds(newState, scope)).toEqual([])
    })
  })

  describe('makeIsOutcomeSelected', () => {
    it('returns true if outcome id is selected', () => {
      expect(makeIsOutcomeSelected(state, scope)('2')).toBe(true)
    })

    it('returns false if outcome is not selected', () => {
      expect(makeIsOutcomeSelected(state, scope)('4')).toBe(false)
    })

    it('returns false if no outcomes are selected', () => {
      const newState = Map()
      expect(makeIsOutcomeSelected(newState, scope)('1')).toBe(false)
    })
  })

  describe('anyOutcomeSelected', () => {
    it('returns true when outcomes are selected', () => {
      expect(anyOutcomeSelected(state, scope)).toBe(true)
    })

    it('returns false if empty selected outcomes', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'selected'], new List())
      expect(anyOutcomeSelected(newState, scope)).toBe(false)
    })

    it('returns false if no selected outcomes', () => {
      const newState = Map()
      expect(anyOutcomeSelected(newState)).toBe(false)
    })
  })

  describe('getActiveCollection', () => {
    it('returns correct values if there is no active collection', () => {
      const data = getActiveCollection(state, scope)
      expect(data.id).toBe('')
      expect(data.header).toBe('')
      expect(data.summary).toBe('')
      expect(data.description).toBe('')
    })

    it('returns the correct values if id if present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      const data = getActiveCollection(newState, scope)
      expect(data.id).toBe(1)
      expect(data.header).toBe('Some outcome 1')
      expect(data.summary).toBe('1 Group | 1 Outcome')
      expect(data.description).toBe('Description 1')
    })
  })

  describe('getActiveChildren', () => {
    it('returns an empty map when no set active', () => {
      expect(getActiveChildren(state, scope)).toEqual({groups: [], nonGroups: []})
    })

    it('returns the list of groups and non groups when present', () => {
      const newState = state.setIn([scope, 'OutcomePicker', 'activeCollection'], '1')
      const { groups, nonGroups } = getActiveChildren(newState, scope)
      expect(groups).toEqual([
        {
          id: 2,
          title: 'Some outcome 2',
          description: 'Description 2',
          child_ids: ['4']
        }
      ])

      expect(nonGroups).toEqual([
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
      expect(getActiveChildren(newState, scope)).toEqual({groups: [], nonGroups: []})
    })
  })

  describe('getOutcomePickerState', () => {
    it('retrieves the correct value', () => {
      expect(getOutcomePickerState(state, scope)).toBe('testing')
    })
  })

  describe('getExpandedIds', () => {
    it('retrieves the correct value', () => {
      expect(getExpandedIds(state, scope)).toEqual(['1'])
    })
  })
})
