/* eslint-disable promise/always-return */
import { expect } from 'chai'
import { List, Map, fromJS } from 'immutable'
import sinon from 'sinon'
import {
  SELECT_OUTCOME_IDS,
  UNSELECT_OUTCOME_IDS,
  SET_SELECTED_OUTCOME_IDS,
  SET_OUTCOME_PICKER_STATE,
  RESET_OUTCOME_PICKER
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'
import { setError, setScoringMethod } from '../../../store/context/actions'
import { setAlignments } from '../../alignments/actions'
import { setScope } from '../../activePicker/actions'

const scopedActions = scopeActions({ ...actions, setError, setScoringMethod, setAlignments, setScope })

describe('OutcomePicker/actions', () => {
  describe('selectOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.selectOutcomeIds([1, 2, 3])
      expect(action.type).to.equal(SELECT_OUTCOME_IDS)
      expect(action.payload).to.deep.equal([1, 2, 3])
    })
  })

  describe('deselectOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.deselectOutcomeIds([1, 2])
      expect(action.type).to.equal(UNSELECT_OUTCOME_IDS)
      expect(action.payload).to.deep.equal([1, 2])
    })
  })

  describe('setSelectedOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.setSelectedOutcomeIds([1, 2, 3])
      expect(action.type).to.equal(SET_SELECTED_OUTCOME_IDS)
      expect(action.payload).to.deep.equal([1, 2, 3])
    })
  })

  describe('setOutcomePickerState', () => {
    it('creates an action', () => {
      const action = actions.setOutcomePickerState('foo')
      expect(action.type).to.equal(SET_OUTCOME_PICKER_STATE)
      expect(action.payload).to.deep.equal('foo')
    })
  })

  describe('loadOutcomePicker', () => {
    it('dispatches state change to loading', () => {
      const store = createMockStore()
      return store.dispatch(actions.loadOutcomePicker())
        .then(() => {
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setOutcomePickerState('loading'))
        })
    })

    it('dispatches loadOutcomes', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve({})) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomePicker())
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          expect(service.loadOutcomes.args[0][3]).to.be.null
        })
    })

    it('dispatches set selected outcome ids', () => {
      const state = fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '101'}, {id: '202'}]
          }
        }
      })
      const store = createMockStore(state)
      return store.dispatch(actions.loadOutcomePicker())
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setSelectedOutcomeIds(['101', '202']))
        })
    })

    it('dispatches state change to choosing', () => {
      const store = createMockStore()
      return store.dispatch(actions.loadOutcomePicker())
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setOutcomePickerState('choosing'))
        })
    })
  })

  describe('setActiveCollection', () => {
    it('sets the underlying collection id', () => {
      const store = createMockStore()
      return store.dispatch(actions.setActiveCollection(12))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setActiveCollectionFrd(12))
        })
    })

    it('calls loadMoreOutcomes', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve({})) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.setActiveCollection(12))
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          expect(service.loadOutcomes.args[0][3]).to.deep.equal([12])
        })
    })
  })

  describe('setFocusedOutcome', () => {
    it('dispatches setFocusedOutcomeAction', () => {
      const service = {
        setFocusedOutcome: sinon.stub().returns(Promise.resolve())
      }
      const store = createMockStore(Map(), service)
      const full = {
        id: 1,
        scoring_method: {
        }
      }
      // If we have the outcome and the outcome has a scoring tier, we do not call outcomes service
      return store.dispatch(actions.setFocusedOutcome(full))
        .then(() => {
          expect(store.getActions()).to.have.length(1)
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setFocusedOutcomeAction(full))
          return null
        })
    })

    it('fetches an outcome and dispatches setFocusedOutcomeAction twice', () => {
      const full = {
        id: 1,
        scoring_method: {
        }
      }
      const service = {
        getOutcome: sinon.stub().returns(Promise.resolve(full)),
        setFocusedOutcome: sinon.stub().returns(Promise.resolve())
      }
      const store = createMockStore(Map(), service)
      const partial = {
        id: 1
      }
      return store.dispatch(actions.setFocusedOutcome(partial))
        .then(() => {
          expect(store.getActions()).to.have.length(4)
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setFocusedOutcomeAction(partial))
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setScoringMethod({
            context_uuid: void 0,
            id: 1,
            scoring_method: {}
          }))
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setFocusedOutcomeAction(full))
          expect(service.getOutcome.calledOnce).to.be.true
          return null
        })
    })

    it('fetches an outcome and dispatches setFocusedOutcomeAction twice with selected shared context', () => {
      const state = fromJS({
        scopeForTest: {
          OutcomePicker: {
            selectedSharedContext: {
              uuid: 'selectedSharedContext',
              name: 'selectedSharedContext'
            }
          }
        }
      })
      const full = {
        id: 1,
        scoring_method: {
        }
      }
      const service = {
        getOutcome: sinon.stub().returns(Promise.resolve(full)),
        setFocusedOutcome: sinon.stub().returns(Promise.resolve())
      }
      const store = createMockStore(state, service)
      const partial = {
        id: 1
      }
      return store.dispatch(actions.setFocusedOutcome(partial))
        .then(() => {
          expect(store.getActions()).to.have.length(4)
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setFocusedOutcomeAction(partial))
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setScoringMethod({
            context_uuid: 'selectedSharedContext',
            id: 1,
            scoring_method: {}
          }))
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setFocusedOutcomeAction(full))
          expect(service.getOutcome.calledOnce).to.be.true
          expect(service.getOutcome.getCall(0).args).to.include('selectedSharedContext')
          return null
        })
    })
  })

  describe('saveOutcomePickerAlignments', () => {
    const state = fromJS({
      context: {
        outcomes: {
          course_100: {
            1: { id: '1' },
            2: { id: '2' }
          }
        }
      },
      scopeForTest: {
        config: {
          contextUuid: 'course_100'
        },
        OutcomePicker: {
          selected: ['1', '2'],
          scope: 'scopeForTest',
        }
      },
    })

    it('wraps its calls in setOutcomePickerState', () => {
      const service = {
        createAlignmentSet: sinon.stub().returns(Promise.resolve(
          {guid: 'newguid', outcomes: [{id: '1'}, {id: '2'}]}
        ))
      }
      const store = createMockStore(state, service)
      return store.dispatch(actions.saveOutcomePickerAlignments())
        .then(() => {
          expect(store.getActions()[0]).to.deep.equal(
            scopedActions.setOutcomePickerState('saving')
          )
          expect(store.getActions()).to.deep.include(scopedActions.setAlignments({
            guid: 'newguid',
            outcomes: [{id: '1'}, {id: '2'}]
          }))
          expect(store.getActions()[store.getActions().length - 1]).to.deep.equal(
            scopedActions.setOutcomePickerState('complete')
          )
        })
    })

    it('fires an updateCallback function if provided', () => {
      const service = {
        createAlignmentSet: sinon.stub().returns(Promise.resolve(
          {guid: 'newguid', outcomes: [{id: '1'}, {id: '2'}]}
        ))
      }
      const store = createMockStore(state, service)
      const callback = sinon.stub()
      return store.dispatch(actions.saveOutcomePickerAlignments(callback))
        .then(() => {
          expect(callback.calledOnce).to.be.true
          expect(callback.calledWith({guid: 'newguid', outcomes: [{id: '1'}, {id: '2'}]})).to.be.true
        })
    })

    it('creates alignment set from selection', () => {
      const newState = state.setIn(['OutcomePicker', 'selected'], List(['1', '2', '3']))
      const service = {
        createAlignmentSet: sinon.stub().returns(Promise.resolve())
      }
      const store = createMockStore(newState, service)
      return store.dispatch(actions.saveOutcomePickerAlignments())
        .then(() => {
          expect(service.createAlignmentSet.calledOnce).to.be.true
          expect(service.createAlignmentSet.calledWith(['1', '2', '3']))
        })
    })

    it('can pull aligned outcomes from previously aligned outcomes', () => {
      const newState = state.deleteIn(['context', 'outcomes', 'course_100', '1'])
        .setIn(['alignments', 'alignedOutcomes'], fromJS([{ id: '1' }]))
      const service = {
        createAlignmentSet: sinon.stub().returns(Promise.resolve())
      }
      const store = createMockStore(newState, service)
      return store.dispatch(actions.saveOutcomePickerAlignments())
        .then(() => {
          expect(service.createAlignmentSet.calledWith(['1', '2']))
        })
    })

    it('dispatches setError on save alignments failure', () => {
      const error = { message: 'foo bar baz' }
      const service = {
        createAlignmentSet: sinon.stub().returns(Promise.reject(error))
      }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.saveOutcomePickerAlignments())
        .then(() => {
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })

    it('calls upsertArtifact if shouldUpdateArtifact is true', () => {
      const service = {
        upsertArtifact: sinon.stub().returns(Promise.resolve({guid: 'guid-1', outcomes: ['1', '2']}))
      }
      const store = createMockStore(state, service)
      return store.dispatch(actions.saveOutcomePickerAlignments(null, true))
        .then(() => {
          expect(service.upsertArtifact.calledWith(['1', '2']))
          expect(store.getActions()).to.deep.include(scopedActions.setAlignments({
            guid: 'guid-1',
            outcomes: [{id: '1'}, {id: '2'}]
          }))
          expect(store.getActions()[store.getActions().length - 1]).to.deep.equal(
            scopedActions.setOutcomePickerState('complete')
          )
        })
    })
  })

  describe('resetOutcomePicker', () => {
    it('creates an action', () => {
      const action = actions.resetOutcomePicker()
      expect(action.type).to.equal(RESET_OUTCOME_PICKER)
    })
  })

  describe('openOutcomePicker', () => {
    it('dispatches flow in the correct order', () => {
      const store = createMockStore()
      store.dispatch(actions.openOutcomePicker())
      expect(store.getActions()[0]).to.deep.equal(scopedActions.setScope('scopeForTest'))
      expect(store.getActions()[1]).to.deep.equal(scopedActions.setOutcomePickerState('loading'))
      expect(store.getActions()).to.have.length(2)
    })

    it('does not try to open an already open picker', () => {
      const state = fromJS({
        scopeForTest: {
          config: {
            contextUuid: 'course_100'
          },
          OutcomePicker: {
            scope: 'scopeForTest',
            state: 'choosing',
          }
        },
      })
      const store = createMockStore(state)
      store.dispatch(actions.openOutcomePicker())
      expect(store.getActions()).to.have.length(0)
    })
  })

  describe('closeOutcomePicker', () => {
    it('dispatches flow in the correct order', () => {
      const store = createMockStore()
      store.dispatch(actions.closeOutcomePicker())
      expect(store.getActions()[0]).to.deep.equal(scopedActions.setScope(''))
      expect(store.getActions()[1]).to.deep.equal(scopedActions.setOutcomePickerState('closed'))
      expect(store.getActions()).to.have.length(2)
    })
  })
})
