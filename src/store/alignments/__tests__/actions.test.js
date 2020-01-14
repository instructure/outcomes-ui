import { Map, fromJS } from 'immutable'
import { expect } from 'chai'
import sinon from 'sinon'
import {
  SET_ALIGNMENTS,
  VIEW_ALIGNMENT,
  CLOSE_ALIGNMENT,
  UPDATE_ALIGNMENT
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'
import { setError } from '../../../store/context/actions'

const scopedActions = scopeActions({ ...actions, setError })

describe('alignments/actions', () => {
  describe('setAlignments', () => {
    it('creates an action', () => {
      const action = actions.setAlignments([])
      expect(action.type).to.equal(SET_ALIGNMENTS)
      expect(action.payload).to.deep.equal([])
    })
  })

  describe('viewAlignment', () => {
    it('creates an action', () => {
      const action = actions.viewAlignmentAction(12)
      expect(action.type).to.equal(VIEW_ALIGNMENT)
      expect(action.payload).to.deep.equal(12)
    })

    it('dispatches viewAlignmentAction', () => {
      const service = {
        viewAlignmentAction: sinon.stub().returns(Promise.resolve())
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
          expect(store.getActions()).to.have.length(1)
          expect(store.getActions()[0]).to.deep.equal(scopedActions.viewAlignmentAction(1))
          return null
        })
    })

    it('fetches an outcome and dispatches updateAlignment', () => {
      const full = {
        id: 1,
        scoring_method: 'boom'
      }
      const service = {
        getOutcome: sinon.stub().returns(Promise.resolve(full))
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
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[0]).to.deep.equal(scopedActions.viewAlignmentAction(1))
          expect(store.getActions()[2]).to.deep.equal(scopedActions.updateAlignment({outcome: full}))
          return null
        })
    })
  })

  describe('updateAlignment', () => {
    it('creates an action', () => {
      const action = actions.updateAlignment(12)
      expect(action.type).to.equal(UPDATE_ALIGNMENT)
      expect(action.payload).to.deep.equal(12)
    })
  })

  describe('closeAlignment', () => {
    it('creates an action', () => {
      const action = actions.closeAlignment()
      expect(action.type).to.equal(CLOSE_ALIGNMENT)
    })
  })

  describe('updateAlignments', () => {
    it('dispatches setAlignments when called', () => {
      const alignments = [{id: '1'}, {id: '2'}]
      const service = { getAlignments: sinon.stub().returns(Promise.resolve(alignments)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.updateAlignments('hexadecimal', alignments))
        .then(() => {
          expect(store.getActions()).to.have.length(1)
          expect(store.getActions()[0]).to.deep.equal(
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
      const callback = sinon.stub().returns(arguments)
      const service = { getAlignments: sinon.stub().returns(Promise.resolve(alignments)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.updateAlignments('hexadecimal', alignments, callback))
        .then(() => {
          expect(callback.calledOnce).to.be.true
          expect(callback.calledWith({guid: 'hexadecimal', outcomes: alignments})).to.be.true
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
          expect(store.getActions()[0]).to.deep.equal(
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
        clearAlignmentSet: sinon.stub().returns(Promise.resolve()),
        getAlignments: sinon.stub().returns(Promise.resolve())
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
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setAlignments({guid: null, outcomes: []}))
          return null
        })
    })

    it('calls outcome service to load alignments', () => {
      const service = { getAlignments: sinon.stub().returns(Promise.resolve()) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal'))
        .then(() => {
          expect(service.getAlignments.calledOnce).to.be.true
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getAlignments: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadAlignments('hexadecimal'))
        .then(() => {
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })

  describe('removeAlignment', () => {
    it('calls outcomes service to create new alignment set', () => {
      const service = { createAlignmentSet: sinon.stub().returns(Promise.resolve()) }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}, {id: '12'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('12'))
        .then(() => {
          expect(service.createAlignmentSet.calledOnce).to.be.true
          expect(service.createAlignmentSet.calledWith([]))
          return null
        })
    })

    it('responds with a null guid and empty outcome array if no alignments remain', () => {
      const service = { clearAlignmentSet: sinon.stub().returns(Promise.resolve()) }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '1'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('1'))
        .then(() => {
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setAlignments({guid: null, outcomes: []}))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'baz bar foo' }
      const service = { createAlignmentSet: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(fromJS({
        scopeForTest: {
          alignments: {
            alignedOutcomes: [{id: '12'}]
          }
        }
      }), service)
      return store.dispatch(actions.removeAlignment('1'))
        .then(() => {
          expect(store.getActions()).to.have.length(2)
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })
})
