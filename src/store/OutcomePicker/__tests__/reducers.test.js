import { expect } from 'chai'
import { fromJS, Set } from 'immutable'
import {
  SET_OUTCOME_PICKER_STATE,
  SELECT_OUTCOME_IDS,
  UNSELECT_OUTCOME_IDS,
  SET_SELECTED_OUTCOME_IDS,
  SET_ACTIVE_COLLECTION_ID,
  RESET_OUTCOME_PICKER,
} from '../../../constants'
import * as actions from '../actions'
import reducer from '../reducers'

describe('OutcomePicker/reducers', () => {
  const state = fromJS({
    focusedOutcome: null,
    selected: Set(['1', '2', '3']),
    state: 'testing',
    scope: 'scopeForTest'
  })

  const reduce = (state, type, payload) => reducer(state, { type, payload })

  describe('state (outcomePickerState)', () => {
    it('is set by SET_OUTCOME_PICKER_STATE', () => {
      const newState = reduce(state, SET_OUTCOME_PICKER_STATE, 'monkey')
      expect(newState.get('state')).to.equal('monkey')
    })
  })

  describe('focusedOutcome', () => {
    it('is set by setFocusedOutcomeAction', () => {
      const next = reducer(state, actions.setFocusedOutcomeAction('rhino'))
      expect(next.get('focusedOutcome')).to.equal('rhino')
    })
  })

  describe('selected', () => {
    describe('adds ids on SELECT_OUTCOME_IDS', () => {
      it('when distinct', () => {
        const newState = reduce(state, SELECT_OUTCOME_IDS, [4, 5])
        expect(newState.get('selected').toJS().sort()).to.deep.equal(['1', '2', '3', '4', '5'])
      })

      it('when not distinct', () => {
        const newState = reduce(state, SELECT_OUTCOME_IDS, [1, 2, 5])
        expect(newState.get('selected').toJS().sort()).to.deep.equal(['1', '2', '3', '5'])
      })
    })

    describe('removes ids on UNSELECT_OUTCOME_IDS', () => {
      it('when present', () => {
        const newState = reduce(state, UNSELECT_OUTCOME_IDS, ['1', '2'])
        expect(newState.get('selected').toJS()).to.deep.equal(['3'])
      })

      it('when absent', () => {
        const newState = reduce(state, UNSELECT_OUTCOME_IDS, ['3', '4'])
        expect(newState.get('selected').toJS().sort()).to.deep.equal(['1', '2'])
      })
    })

    it('replaces ids on SET_SELECTED_OUTCOME_IDS', () => {
      const newState = reduce(state, SET_SELECTED_OUTCOME_IDS, ['2', '5'])
      expect(newState.get('selected').toJS().sort()).to.deep.equal(['2', '5'])
    })
  })

  describe('activeCollection', () => {
    it('is set by SET_ACTIVE_COLLECTION_ID', () => {
      const newState = reduce(state, SET_ACTIVE_COLLECTION_ID, '1701')
      expect(newState.get('activeCollection')).to.equal('1701')
    })
  })

  describe('expandedIds', () => {
    it('is set by toggleExpandedIds', () => {
      const next = reducer(state, actions.toggleExpandedIds({id: 1}))
      expect(next.get('expandedIds').toJS()).to.deep.equal(['1'])
    })

    it('properly adds and removes ids from the set', () => {
      const firstState = reducer(state, actions.toggleExpandedIds({id: 1}))
      const secondState = reducer(firstState, actions.toggleExpandedIds({id: 2}))
      expect(secondState.get('expandedIds').toJS()).to.deep.equal(['1', '2'])
      const thirdState = reducer(secondState, actions.toggleExpandedIds({id: 1}))
      expect(thirdState.get('expandedIds').toJS()).to.deep.equal(['2'])
    })

    it('does not remove an id if collection is forced open', () => {
      const firstState = reducer(state, actions.toggleExpandedIds({id: 1}))
      const secondState = reducer(firstState, actions.toggleExpandedIds({id: 1, forceOpen: true}))
      expect(secondState.get('expandedIds').toJS()).to.deep.equal(['1'])
    })
  })

  describe('when action type is RESET_OUTCOME_PICKER ', () => {
    it('resets state to default', () => {
      const newState = reduce(state, RESET_OUTCOME_PICKER, 'scopeForTest')
      expect(newState.get('state')).to.equal('closed') // eslint-disable-line no-console
      expect(newState.get('selected').toJS()).to.deep.equal([])
    })
  })
})
