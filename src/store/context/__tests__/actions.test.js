import { expect } from 'chai'
import sinon from 'sinon'
import { Map, fromJS } from 'immutable'
import {
  SET_OUTCOMES,
  SET_ROOT_OUTCOME_IDS,
  SET_ERROR,
  SET_SCORING_METHOD
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'

const scopedActions = scopeActions(actions)

const response = {
  outcomes: [{id: 1}, {id: 2}],
  root_ids: [1, 2]
}

const stateWithoutOutcomes = fromJS({
  scopeForTest: {
    config: {
      contextUuid: 'course_100'
    }
  }
})

const stateWithOutcomes = fromJS({
  context: {
    outcomes: {
      course_100: [{ id: 1 }]
    },
    rootOutcomeIds: {
      course_100: [ 1 ]
    }
  },
  scopeForTest: {
    config: {
      contextUuid: 'course_100'
    }
  }
})

const stateWithSelectedSharedContext = stateWithOutcomes.merge({
  scopeForTest: {
    OutcomePicker: {
      selectedSharedContext: {uuid: 'selectedSharedContext', name: 'selectedSharedContext'}
    }
  }
})

const contextUuidIndex = 2
const outcomeIdsIndex = 3

describe('context/actions', () => {
  describe('setOutcomes', () => {
    it('creates an action', () => {
      const action = actions.setOutcomes([])
      expect(action.type).to.equal(SET_OUTCOMES)
      expect(action.payload).to.deep.equal([])
    })
  })

  describe('setRootOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.setRootOutcomeIds([])
      expect(action.type).to.equal(SET_ROOT_OUTCOME_IDS)
      expect(action.payload).to.deep.equal([])
    })
  })

  describe('setError', () => {
    it('creates an action', () => {
      const action = actions.setError('foo')
      expect(action.type).to.equal(SET_ERROR)
      expect(action.payload).to.deep.equal('foo')
    })
  })

  describe('setScoringMethod', () => {
    it('creates an action', () => {
      const payload = {
        id: 1,
        context_uuid: '',
        scoring_method: {}
      }
      const action = actions.setScoringMethod(payload)
      expect(action.type).to.equal(SET_SCORING_METHOD)
      expect(action.payload).to.deep.equal(payload)
    })
  })

  describe('loadOutcomes', () => {
    it('does not call any actions when outcomes already loaded', () => {
      const store = createMockStore(stateWithOutcomes)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).to.have.length(0)
          return null
        })
    })

    it('calls outcome service to load outcomes', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          return null
        })
    })

    it('calls outcome service to load outcomes with selected shared context', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithSelectedSharedContext, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          expect(service.loadOutcomes.getCall(0).args).to.include('selectedSharedContext')
          return null
        })
    })

    it('dispatches setOutcomes on outcome service success', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setOutcomes({ course_100: response.outcomes }))
          expect(store.getActions()[0].payload.root).to.be.present
          return null
        })
    })

    it('dispatches setOutcomes on outcome service success with selected shared context', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithSelectedSharedContext, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setOutcomes(
            { selectedSharedContext: response.outcomes }
          ))
          expect(store.getActions()[0].payload.root).to.be.present
          return null
        })
    })

    it('creates a root level outcome to store roots if root ids are present', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()[0].payload.root).to.be.present
          return null
        })
    })

    it('does not create a root level outcome if root ids are not present', () => {
      const service = {
        loadOutcomes: sinon.stub().returns(Promise.resolve({
          outcomes: [{id: 1}, {id: 2}],
          root_ids: []
        }))
      }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()[0].payload.root).not.to.be.present
          return null
        })
    })

    it('dispatches setRootOutcomeIds on outcome service success', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setRootOutcomeIds({ course_100: response.root_ids }))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { loadOutcomes: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).to.have.length(2)
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })

  describe('loadMoreOutcomes', () => {
    it('calls loadOutcomes for unloaded children', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          expect(service.loadOutcomes.args[0][contextUuidIndex]).to.deep.equal('course_100')
          expect(service.loadOutcomes.args[0][outcomeIdsIndex]).to.deep.equal(['1'])
          return null
        })
    })

    it('calls loadOutcomes for unloaded children when shared context is selected', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithSelectedSharedContext, service)

      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(service.loadOutcomes.calledOnce).to.be.true
          expect(service.loadOutcomes.args[0][contextUuidIndex]).to.deep.equal('selectedSharedContext')
          expect(service.loadOutcomes.args[0][outcomeIdsIndex]).to.deep.equal(['1'])
          return null
        })
    })

    it('adds its outcomes to the state', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setOutcomes({ course_100: response.outcomes }))
          return null
        })
    })

    it('adds its outcomes to the state under the selected shared context', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithSelectedSharedContext, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).to.deep.include(
            scopedActions.setOutcomes({ selectedSharedContext: response.outcomes })
          )
          return null
        })
    })

    it('does not add its root ids to the state', () => {
      const service = { loadOutcomes: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).not.to.deep.include(
            scopedActions.setRootOutcomeIds({ course_100: response.root_ids })
          )
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { loadOutcomes: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadMoreOutcomes('12'))
        .then(() => {
          expect(store.getActions()).to.have.length(2)
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })

  describe('loadContext', () => {
    const response = {
      id: 1
    }

    const stateWithoutContext = fromJS({
      context: {
        contexts: {}
      }
    })

    const stateWithContext = fromJS({
      context: {
        contexts: {
          '1': {
            loading: false,
            data: {
              id: 1
            }
          }
        }
      }
    })

    const stateWithContextLoading = fromJS({
      context: {
        contexts: {
          '1': {
            loading: true
          }
        }
      }
    })

    it('calls getContext for unloaded children', () => {
      const service = { getContext: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithoutContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(service.getContext.calledOnce).to.be.true
          expect(service.getContext.args[0][2]).to.equal('1')
          return null
        })
    })

    it('adds its context to the state', () => {
      const service = { getContext: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithoutContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setContext({ '1': { loading: false, data: response } }))
          return null
        })
    })

    it('does not calls service when its already loaded', () => {
      const service = { getContext: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions().length).to.be.equal(0)
          return null
        })
    })

    it('does not calls service when its loading', () => {
      const service = { getContext: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(stateWithContextLoading, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions().length).to.be.equal(0)
          return null
        })
    })

    it('dispatches setError on service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getContext: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadContext('host', 'jwt', '12'))
        .then(() => {
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })
})
