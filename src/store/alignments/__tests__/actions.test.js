import { Map, fromJS } from 'immutable'
import { expect, describe, it, jest } from '@jest/globals'
import {
  SET_ALIGNMENTS,
  VIEW_ALIGNMENT,
  CLOSE_ALIGNMENT,
  UPDATE_ALIGNMENT
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import * as actions from '../actions'
import { setError } from '../../context/actions'

const scopedActions = scopeActions({ ...actions, setError })

describe('alignments/actions', () => {
  describe('setAlignments', () => {
    it('creates an action', () => {
      const action = actions.setAlignments([])
      expect(action.type).toBe(SET_ALIGNMENTS)
      expect(action.payload).toEqual([])
    })
  })

  describe('viewAlignment', () => {
    it('creates an action', () => {
      const action = actions.viewAlignmentAction(12)
      expect(action.type).toBe(VIEW_ALIGNMENT)
      expect(action.payload).toEqual(12)
    })

    it('dispatches viewAlignmentAction', () => {
      const service = {
        viewAlignmentAction: jest.fn().mockResolvedValue()
      }
      const state = fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: 1, scoring_method: 'boom'}],
            alignmentSetId: 'badong'
          }
        }
      })
      const store = createMockStore(state, service)
      return store.dispatch(actions.viewAlignment(1))
        .then(() => {
          expect(store.getActions()).toHaveLength(1)
          expect(store.getActions()[0]).toEqual(scopedActions.viewAlignmentAction(1))
          return null
        })
    })

    it('fetches an outcome and dispatches updateAlignment', () => {
      const full = {
        id: 1,
        scoring_method: 'boom'
      }
      const service = {
        getOutcome: jest.fn().mockResolvedValue(full)
      }
      const state = fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: 1}],
            alignmentSetId: 'badong'
          }
        }
      })
      const store = createMockStore(state, service)
      return store.dispatch(actions.viewAlignment(1))
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(store.getActions()[0]).toEqual(scopedActions.viewAlignmentAction(1))
          expect(store.getActions()[2]).toEqual(scopedActions.updateAlignment({outcome: full}))
          return null
        })
    })
  })

  describe('updateAlignment', () => {
    it('creates an action', () => {
      const action = actions.updateAlignment(12)
      expect(action.type).toBe(UPDATE_ALIGNMENT)
      expect(action.payload).toEqual(12)
    })
  })

  describe('closeAlignment', () => {
    it('creates an action', () => {
      const action = actions.closeAlignment()
      expect(action.type).toBe(CLOSE_ALIGNMENT)
    })
  })

  describe('updateAlignments', () => {
    it('dispatches setAlignments when called', () => {
      const alignments = [{id: '1'}, {id: '2'}]
      const service = { getAlignments: jest.fn().mockResolvedValue(alignments) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.updateAlignments('hexadecimal', alignments))
        .then(() => {
          expect(store.getActions()).toHaveLength(1)
          expect(store.getActions()[0]).toEqual(
            scopedActions.setAlignments({
              guid: 'hexadecimal',
              outcomes: alignments
            })
          )
          return null
        })
    })

    it('fires an updateCallback function if provided', () => {
      const alignments = [{id: '1'}, {id: '2'}]
      const callback = jest.fn()
      const service = { getAlignments: jest.fn().mockResolvedValue(alignments) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.updateAlignments('hexadecimal', alignments, callback))
        .then(() => {
          expect(callback).toHaveBeenCalledTimes(1)
          expect(callback).toHaveBeenCalledWith({guid: 'hexadecimal', outcomes: alignments})
          return null
        })
    })
  })

  describe('loadAlignments', () => {
    it('responds with a null guid and empty outcome array if the alignmentSetId does not match the scope', () => {
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}],
            alignmentSetId: 'badong'
          }
        }
      }))
      return store.dispatch(actions.loadAlignments('gnodab'))
        .then(() => {
          expect(store.getActions()[0]).toEqual(
            scopedActions.setAlignments({
              guid: null,
              outcomes: []
            })
          )
          return null
        })
    })

    it('responds with a null guid and empty outcome array if there is no alignment set id', () => {
      const service = {
        clearAlignmentSet: jest.fn().mockResolvedValue(),
        getAlignments: jest.fn().mockResolvedValue()
      }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}]
          }
        }
      }), service)
      return store.dispatch(actions.loadAlignments(null))
        .then(() => {
          expect(store.getActions()[0]).toEqual(scopedActions.setAlignments({guid: null, outcomes: []}))
          return null
        })
    })

    it('calls outcome service to load alignments', () => {
      const service = { getAlignments: jest.fn().mockResolvedValue() }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal'))
        .then(() => {
          expect(service.getAlignments).toHaveBeenCalledTimes(1)
          return null
        })
    })

    it('does not set launch contexts to empty array ', () => {
      const service = { getAlignments: jest.fn().mockReturnValue({guid: 'guid', outcomes: []}) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal', []))
        .then(() => {
          for (const action of store.getActions()) {
            expect(action.type).not.toBe('SET_LAUNCH_CONTEXTS')
          }
          expect(service.getAlignments).toHaveBeenCalledTimes(1)
          return null
        })
    })

    it('sets Launch context if one is supplied', () => {
      const service = { getAlignments: jest.fn().mockReturnValue({guid: 'guid', outcomes: []}) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal', [{uuid: 'foo', name: 'Dave University'}]))
        .then(() => {
          expect(store.getActions()[0]).toEqual(
            scopedActions.setLaunchContexts([{uuid: 'foo', name: 'Dave University'}])
          )
          expect(service.getAlignments).toHaveBeenCalledTimes(1)
          return null
        })
    })

    it('calls outcome service with launchContext to load alignments', () => {
      const service = { getAlignments: jest.fn().mockResolvedValue() }
      const store = createMockStore(Map(fromJS({
        scopeForTest: {
          alignments: {
            launchContexts: [{uuid: 'foo', name: 'Dave University'}]
          }
        }
      })), service)
      return store.dispatch(actions.loadAlignments('hexadecimal'))
        .then(() => {
          // launch contexts is not passed to loadAlignments. Instead, it is read from the store.
          for (const action of store.getActions()) {
            expect(action.type).not.toBe('SET_LAUNCH_CONTEXTS')
          }
          expect(service.getAlignments).toHaveBeenCalledTimes(1)
          expect(service.getAlignments.mock.calls[0]).toContain('foo')
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getAlignments: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal'))
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(store.getActions()[2]).toEqual(scopedActions.setError(error))
          return null
        })
    })
  })

  describe('loadArtifact', () => {
    it('calls outcome service to load artfiact', () => {
      const response = {guid: 'guid', outcomes: [{id: '1'}]}
      const service = { getArtifact: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadArtifact({artifactType: 'type', artifactId: '1'}))
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(service.getArtifact).toHaveBeenCalledTimes(1)
          expect(store.getActions()[2]).toEqual(scopedActions.setAlignments(response))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getArtifact: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadArtifact({artifactType: '', artifactId: ''}))
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(store.getActions()[2]).toEqual(scopedActions.setError(error))
          return null
        })
    })
  })


  describe('removeAlignment', () => {
    it('calls outcomes service to create new alignment set', () => {
      const service = { createAlignmentSet: jest.fn().mockResolvedValue() }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}, {id: '12'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('12'))
        .then(() => {
          expect(service.createAlignmentSet).toHaveBeenCalledTimes(1)
          expect(service.createAlignmentSet.mock.calls[0][2]).toEqual(['1'])
          return null
        })
    })

    it('calls outcomes service to create new alignment set with launch context', () => {
      const service = { createAlignmentSet: jest.fn().mockResolvedValue() }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}, {id: '12'}],
            launchContexts: [{uuid: 'foo', name: 'bar'}, {uuid: 'fuz', name: 'baz'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('12'))
        .then(() => {
          expect(service.createAlignmentSet).toHaveBeenCalledTimes(1)
          expect(service.createAlignmentSet.mock.calls[0][2]).toEqual(['1'])
          expect(service.createAlignmentSet.mock.calls[0][3]).toBe('fuz')
          return null
        })
    })

    it('responds with a null guid and empty outcome array if no alignments remain', () => {
      const service = { clearAlignmentSet: jest.fn().mockResolvedValue() }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('1'))
        .then(() => {
          expect(store.getActions()[0]).toEqual(scopedActions.setAlignments({guid: null, outcomes: []}))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'baz bar foo' }
      const service = { createAlignmentSet: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '12'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('1'))
        .then(() => {
          expect(store.getActions()).toHaveLength(2)
          expect(store.getActions()[1]).toEqual(scopedActions.setError(error))
          return null
        })
    })

    it('calls upsertArtifact if shouldUpdateArtifact is true', () => {
      const response = {guid: 'my-guid-1', outcomes: [{id: '1'}]}
      const service = {upsertArtifact: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}, {id: '12'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('12', null, true))
        .then(() => {
          expect(service.upsertArtifact).toHaveBeenCalledTimes(1)
          expect(store.getActions()[0].payload.args.slice(-1)).toEqual([['1']])
          expect(store.getActions()).toContainEqual(scopedActions.setAlignments(response))
          return null
        })
    })
  })
})
