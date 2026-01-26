/* eslint-disable promise/always-return */
import { expect, jest, describe, it } from '@jest/globals'
import { List, Map, fromJS } from 'immutable'
import {
  SELECT_OUTCOME_IDS,
  UNSELECT_OUTCOME_IDS,
  SET_SELECTED_OUTCOME_IDS,
  SET_OUTCOME_PICKER_STATE,
  RESET_OUTCOME_PICKER
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import * as actions from '../actions'
import { setError, setScoringMethod } from '../../context/actions'
import { setAlignments } from '../../alignments/actions'
import { setScope } from '../../activePicker/actions'

const scopedActions = scopeActions(
  { ...actions, setError, setScoringMethod, setAlignments, setScope }
)

describe('OutcomePicker/actions', () => {
  describe('selectOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.selectOutcomeIds([1, 2, 3])
      expect(action.type).toBe(SELECT_OUTCOME_IDS)
      expect(action.payload).toEqual([1, 2, 3])
    })
  })

  describe('deselectOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.deselectOutcomeIds([1, 2])
      expect(action.type).toBe(UNSELECT_OUTCOME_IDS)
      expect(action.payload).toEqual([1, 2])
    })
  })

  describe('setSelectedOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.setSelectedOutcomeIds([1, 2, 3])
      expect(action.type).toBe(SET_SELECTED_OUTCOME_IDS)
      expect(action.payload).toEqual([1, 2, 3])
    })
  })

  describe('setOutcomePickerState', () => {
    it('creates an action', () => {
      const action = actions.setOutcomePickerState('foo')
      expect(action.type).toBe(SET_OUTCOME_PICKER_STATE)
      expect(action.payload).toEqual('foo')
    })
  })
})

describe('loadOutcomePicker', () => {
  it('dispatches state change to loading', () => {
    const store = createMockStore()
    return store.dispatch(actions.loadOutcomePicker())
      .then(() => {
        expect(store.getActions()[0]).toEqual(scopedActions.setOutcomePickerState('loading'))
      })
  })

  it('dispatches loadOutcomes', () => {
    const service = { loadOutcomes: jest.fn().mockResolvedValue({}) }
    const store = createMockStore(Map(), service)
    return store.dispatch(actions.loadOutcomePicker())
      .then(() => {
        expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
        expect(service.loadOutcomes.mock.calls[0][3]).toBeNull()
      })
  })

  it('dispatches set selected outcome ids', () => {
    const state = fromJS({
      scopeForTest: {
        alignments: {
          alignedOutcomes: [{ id: '101' }, { id: '202' }]
        }
      }
    })
    const store = createMockStore(state)
    return store.dispatch(actions.loadOutcomePicker())
      .then(() => {
        expect(store.getActions()).toContainEqual(scopedActions.setSelectedOutcomeIds(['101', '202']))
      })
  })

  it('dispatches state change to choosing', () => {
    const store = createMockStore()
    return store.dispatch(actions.loadOutcomePicker())
      .then(() => {
        expect(store.getActions()).toContainEqual(scopedActions.setOutcomePickerState('choosing'))
      })
  })
})

describe('loadSelectedLaunchContext', () => {
  it('does not setSelectedLaunchContext when there is no launch context', () => {
    const store = createMockStore(Map(fromJS({
      scopeForTest: {
        alignments: {
        }
      }
    })))
    store.dispatch(actions.loadSelectedLaunchContext())
    expect(store.getActions().length).toBe(0)
  })

  it('does not setSelectedLaunchContext when launch context is empty', () => {
    const store = createMockStore(Map(fromJS({
      scopeForTest: {
        alignments: {
          launchContexts: []
        }
      }
    })))
    store.dispatch(actions.loadSelectedLaunchContext())
    expect(store.getActions().length).toBe(0)
  })

  it('does not setSelectedLaunchContext when already selected', () => {
    const store = createMockStore(Map(fromJS({
      scopeForTest: {
        alignments: {
        },
        OutcomePicker: {
          selectedLaunchContext: { uuid: 'foo', name: 'Dave University' }
        }
      }
    })))
    store.dispatch(actions.loadSelectedLaunchContext())
    expect(store.getActions().length).toBe(0)
  })

  it('setSelectedLaunchContext when launch context is not empty', () => {
    const store = createMockStore(Map(fromJS({
      scopeForTest: {
        alignments: {
          launchContexts: [{ uuid: 'foo', name: 'Dave University' }]
        }
      }
    })))
    store.dispatch(actions.loadSelectedLaunchContext())
    expect(store.getActions().length).toBe(1)
    expect(store.getActions()[0]).toEqual(
      scopedActions.setSelectedLaunchContext({ uuid: 'foo', name: 'Dave University' })
    )
  })
})

describe('changeSelectedLaunchContext', () => {
  it('updates selected launch context', () => {
    const store = createMockStore()
    return store.dispatch(actions.changeSelectedLaunchContext({ uuid: 'uuid', name: 'name' }))
      .then(() => {
        expect(store.getActions()).toContainEqual(scopedActions.setSelectedLaunchContext({ uuid: 'uuid', name: 'name' }))
      })
  })
})

describe('setActiveCollection', () => {
  it('sets the underlying collection id', () => {
    const store = createMockStore()
    return store.dispatch(actions.setActiveCollection(12))
      .then(() => {
        expect(store.getActions()).toContainEqual(scopedActions.setActiveCollectionFrd(12))
      })
  })

  it('calls loadMoreOutcomes', () => {
    const service = { loadOutcomes: jest.fn().mockResolvedValue({}) }
    const store = createMockStore(Map(), service)
    return store.dispatch(actions.setActiveCollection(12))
      .then(() => {
        expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
        expect(service.loadOutcomes.mock.calls[0][3]).toEqual([12])
      })
  })
})

describe('setFocusedOutcome', () => {
  it('dispatches setFocusedOutcomeAction', () => {
    const service = {
      setFocusedOutcome: jest.fn().mockResolvedValue()
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
        expect(store.getActions()).toHaveLength(1)
        expect(store.getActions()[0]).toEqual(scopedActions.setFocusedOutcomeAction(full))
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
      getOutcome: jest.fn().mockResolvedValue(full),
      setFocusedOutcome: jest.fn().mockResolvedValue()
    }
    const store = createMockStore(Map(), service)
    const partial = {
      id: 1
    }
    return store.dispatch(actions.setFocusedOutcome(partial))
      .then(() => {
        expect(store.getActions()).toHaveLength(4)
        expect(store.getActions()[0]).toEqual(scopedActions.setFocusedOutcomeAction(partial))
        expect(store.getActions()[2]).toEqual(scopedActions.setScoringMethod({
          context_uuid: undefined,
          id: 1,
          scoring_method: {}
        }))
        expect(store.getActions()[3]).toEqual(scopedActions.setFocusedOutcomeAction(full))
        expect(service.getOutcome).toHaveBeenCalledTimes(1)
        return null
      })
  })

  it('fetches an outcome and dispatches setFocusedOutcomeAction twice with selected launch context', () => {
    const state = fromJS({
      scopeForTest: {
        OutcomePicker: {
          selectedLaunchContext: {
            uuid: 'selectedLaunchContext',
            name: 'selectedLaunchContext'
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
      getOutcome: jest.fn().mockResolvedValue(full),
      setFocusedOutcome: jest.fn().mockResolvedValue()
    }
    const store = createMockStore(state, service)
    const partial = {
      id: 1
    }
    return store.dispatch(actions.setFocusedOutcome(partial))
      .then(() => {
        expect(store.getActions()).toHaveLength(4)
        expect(store.getActions()[0]).toEqual(scopedActions.setFocusedOutcomeAction(partial))
        expect(store.getActions()[2]).toEqual(scopedActions.setScoringMethod({
          context_uuid: 'selectedLaunchContext',
          id: 1,
          scoring_method: {}
        }))
        expect(store.getActions()[3]).toEqual(scopedActions.setFocusedOutcomeAction(full))
        expect(service.getOutcome).toHaveBeenCalledTimes(1)
        expect(service.getOutcome.mock.calls[0]).toContain('selectedLaunchContext')
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
      createAlignmentSet: jest.fn().mockResolvedValue(
        { guid: 'newguid', outcomes: [{ id: '1' }, { id: '2' }] }
      )
    }
    const store = createMockStore(state, service)
    return store.dispatch(actions.saveOutcomePickerAlignments())
      .then(() => {
        expect(store.getActions()[0]).toEqual(
          scopedActions.setOutcomePickerState('saving')
        )
        expect(store.getActions()).toContainEqual(scopedActions.setAlignments({
          guid: 'newguid',
          outcomes: [{ id: '1' }, { id: '2' }]
        }))
        expect(store.getActions()[store.getActions().length - 1]).toEqual(
          scopedActions.setOutcomePickerState('complete')
        )
      })
  })

  it('fires an updateCallback function if provided', () => {
    const service = {
      createAlignmentSet: jest.fn().mockResolvedValue(
        { guid: 'newguid', outcomes: [{ id: '1' }, { id: '2' }] }
      )
    }
    const store = createMockStore(state, service)
    const callback = jest.fn()
    return store.dispatch(actions.saveOutcomePickerAlignments(callback))
      .then(() => {
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith({ guid: 'newguid', outcomes: [{ id: '1' }, { id: '2' }] })
      })
  })

  it('creates alignment set from selection', () => {
    const newState = state.setIn(['scopeForTest', 'OutcomePicker', 'selected'], List(['1', '2', '3']))
    const service = {
      createAlignmentSet: jest.fn().mockResolvedValue()
    }
    const store = createMockStore(newState, service)
    return store.dispatch(actions.saveOutcomePickerAlignments())
      .then(() => {
        expect(service.createAlignmentSet).toHaveBeenCalledTimes(1)
        expect(service.createAlignmentSet.mock.calls[0][2]).toEqual(['1', '2', '3'])
      })
  })

  it('can pull aligned outcomes from previously aligned outcomes', () => {
    const newState = state.deleteIn(['context', 'outcomes', 'course_100', '1'])
      .setIn(['alignments', 'alignedOutcomes'], fromJS([{ id: '1' }]))
    const service = {
      createAlignmentSet: jest.fn().mockResolvedValue()
    }
    const store = createMockStore(newState, service)
    return store.dispatch(actions.saveOutcomePickerAlignments())
      .then(() => {
        expect(service.createAlignmentSet).toHaveBeenCalledTimes(1)
        expect(service.createAlignmentSet.mock.calls[0][2]).toEqual(['1', '2'])
      })
  })

  it('dispatches setError on save alignments failure', () => {
    const error = { message: 'foo bar baz' }
    const service = {
      createAlignmentSet: jest.fn().mockRejectedValue(error)
    }
    const store = createMockStore(Map(), service)
    return store.dispatch(actions.saveOutcomePickerAlignments())
      .then(() => {
        expect(store.getActions()).toHaveLength(3)
        expect(store.getActions()[2]).toEqual(scopedActions.setError(error))
        return null
      })
  })

  it('calls upsertArtifact if shouldUpdateArtifact is true', () => {
    const service = {
      upsertArtifact: jest.fn().mockResolvedValue({ guid: 'guid-1', outcomes: ['1', '2'] })
    }
    const store = createMockStore(state, service)
    return store.dispatch(actions.saveOutcomePickerAlignments(null, true))
      .then(() => {
        expect(service.upsertArtifact).toHaveBeenCalledTimes(1)
        expect(service.upsertArtifact.mock.calls[0][5]).toEqual(['1', '2'])
        expect(store.getActions()).toContainEqual(scopedActions.setAlignments({
          guid: 'guid-1',
          outcomes: [{ id: '1' }, { id: '2' }]
        }))
        expect(store.getActions()[store.getActions().length - 1]).toEqual(
          scopedActions.setOutcomePickerState('complete')
        )
      })
  })
})

describe('resetOutcomePicker', () => {
  it('creates an action', () => {
    const action = actions.resetOutcomePicker()
    expect(action.type).toBe(RESET_OUTCOME_PICKER)
  })
})

describe('openOutcomePicker', () => {
  it('dispatches flow in the correct order', () => {
    const store = createMockStore()
    store.dispatch(actions.openOutcomePicker())
    expect(store.getActions()[0]).toEqual(scopedActions.setScope('scopeForTest'))
    expect(store.getActions()[1]).toEqual(scopedActions.setOutcomePickerState('loading'))
    expect(store.getActions()).toHaveLength(2)
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
    expect(store.getActions()).toHaveLength(0)
  })
})

describe('closeOutcomePicker', () => {
  it('dispatches flow in the correct order', () => {
    const store = createMockStore()
    store.dispatch(actions.closeOutcomePicker())
    expect(store.getActions()[0]).toEqual(scopedActions.setScope(''))
    expect(store.getActions()[1]).toEqual(scopedActions.setOutcomePickerState('closed'))
    expect(store.getActions()).toHaveLength(2)
  })
})
