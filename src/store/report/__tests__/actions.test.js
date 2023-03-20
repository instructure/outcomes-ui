import { expect } from 'chai'
import { fromJS, Map } from 'immutable'
import { wrapAction } from 'multireducer'
import sinon from 'sinon'

import * as actions from '../actions'
import { SET_ERROR, VIEW_REPORT_ALIGNMENT, CLOSE_REPORT_ALIGNMENT, NOT_FETCHING, IN_PROGRESS, COMPLETED, ERROR } from '../../../constants'
import { setError } from '../../context/actions'
import createMockStore, { scopeActions } from '../../../test/createMockStore'

const scopedActions = scopeActions({ ...actions, setError })

const getUsersResponse = {
  users: [
    { uuid: '100' },
    { uuid: '100' }
  ],
  perPage: 50,
  total: 2
}

const rollupResponse = [
  {
    count: 2,
    mastery_count: 1,
    average_score: 0.3,
    outcome: {
      id: 2848,
      guid: '7DE656A0-7440-11DF-93FA-01FD9CFF4B22',
      title: 'Read grade-level text with purpose and understanding.',
      parent_id: 2257,
      position: 0,
      created_at: '2017-05-09T20:46:26.411Z',
      updated_at: '2017-05-09T20:46:26.411Z',
      label: 'CCSS.ELA-Literacy.RF.1.4.a',
      description: 'Read grade-level text with purpose and understanding.'
    }
  },
  {
    count: 2,
    mastery_count: 2,
    average_score: 0.7,
    uses_bank: false,
    outcome: {
      id: 2849,
      guid: '7DE6D0EE-7440-11DF-93FA-01FD9CFF4B22',
      title: 'Read grade-level text orally with accuracy, appropriate rate, and expression on successive readings.',
      parent_id: 2257,
      position: 1,
      created_at: '2017-05-09T20:12:06.430Z',
      updated_at: '2017-05-09T20:12:06.430Z',
      label: 'CCSS.ELA-Literacy.RF.1.4.b',
      description: 'Read grade-level text orally with accuracy, appropriate rate, and expression on successive readings.' // eslint-disable-line max-len
    }
  }
]

const fakeResults = {
  2848: [
    { user_uuid: 'bc5c4f0e-bfbb-46a7-98f3-1ee8c86a1c6f', percent_score: 0.3, points: 30.0, points_possible: 100 },
    { user_uuid: '560fddd9-9b16-4e3a-969c-2f095e7afc78', percent_score: 0.8, points: 80.0, points_possible: 100 }
  ],
  2849: [
    { user_uuid: 'bc5c4f0e-bfbb-46a7-98f3-1ee8c86a1c6f', percent_score: 0.9, points: 90.0, points_possible: 100 },
    { user_uuid: '560fddd9-9b16-4e3a-969c-2f095e7afc78', percent_score: 0.8, points: 80.0, points_possible: 100 }
  ]
}

const rollups = rollupResponse.map(({
  count,
  mastery_count: masteryCount,
  outcome,
  average_score: averageScore,
  child_artifact_count: childArtifactCount,
  uses_bank: usesBank
}) => ({
  outcomeId: outcome.id, count, masteryCount, averageScore, childArtifactCount, usesBank
}))

const userList = fakeResults['2848'].map((user) => user.user_uuid)
const users = userList.map((uuid) => ({ uuid }))

const service = {
  getUsers: sinon.stub().resolves({ users }),
  getOutcomeRollups: sinon.stub().resolves(rollupResponse),
  getOutcomeResults: (host, jwt, t, i, outcomeId) => {
    return Promise.resolve(fakeResults[outcomeId.toString()])
  }
}

const failedService = { getOutcomeRollups: sinon.stub().rejects({ error: 'OHNO' }) }

describe('report/actions', () => {
  describe('loadRollups', () => {
    it('calls outcome service to load rollups and individual results', () => {
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { '0': users } } } }
      const store = createMockStore(Map(fromJS(state)), service)
      return store.dispatch(actions.loadRollups('quiz', 101))
        .then(() => {
          const [add, update] = store.getActions().slice(1)
          expect(add.type).to.equal(actions.setReportOutcomes.toString())
          rollupResponse.forEach((r) => {
            expect(add.payload[r.outcome.id]).to.deep.equal(r.outcome)
          })

          expect(update.type).to.equal(actions.setRollups.toString())
          expect(update.payload).to.deep.equal(rollups)

          store.getActions()
            .filter((act) => act.payload.method === 'getOutcomeResults')
            .forEach((act) => {
              const [requestedUsers] = act.payload.args.slice(-1)
              expect(requestedUsers).to.deep.equal(userList)
            })

          const resultActions = store.getActions().slice(-2)
          resultActions.forEach((act) => {
            const { outcomeId, seenResults } = act.payload
            const results = fakeResults[outcomeId]
            expect(act).to.deep.equal(scopedActions.setResults({ outcomeId, results, seenResults }))
          })

          return null
        })
    })

    it('dispatches failure action on failure', () => {
      const store = createMockStore(Map(), failedService)
      return store.dispatch(actions.loadRollups('quiz', 101))
        .then(() => {
          const [err] = store.getActions().slice(1)
          expect(err.type).to.equal(SET_ERROR)
          return null
        })
    })

    describe('viewReportAlignment', () => {
      it('creates an action', () => {
        const action = actions.viewReportAlignment(12)
        expect(action.type).to.equal(VIEW_REPORT_ALIGNMENT)
        expect(action.payload).to.deep.equal(12)
      })
    })

    describe('closeReportAlignment', () => {
      it('creates an action', () => {
        const action = actions.closeReportAlignment()
        expect(action.type).to.equal(CLOSE_REPORT_ALIGNMENT)
      })
    })
  })

  describe('loadPage', () => {
    it('changes the page, then loads users / score data', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1, loading: false }, users: {} }
        }
      }
      const store = createMockStore(fromJS(state), service)

      return store.dispatch(actions.loadPage('quiz', 101, 2)).then(() => {
        expect(store.getActions()).to.deep.include.members([
          wrapAction(actions.setPage({ number: 2, loading: true }), 'scopeForTest'),
          wrapAction(actions.setUsers({2: users}), 'scopeForTest'),
          wrapAction(actions.setRollups(rollups), 'scopeForTest'),
          wrapAction(actions.setPage({ number: 2, loading: false }), 'scopeForTest')
        ])
        return null
      })
    })

    it('will reload the current page', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 10, loading: false }, users: { } }
        }
      }
      const store = createMockStore(fromJS(state), service)

      return store.dispatch(actions.loadPage('quiz', 101, 10)).then(() => {
        expect(store.getActions()).to.deep.include.members([
          wrapAction(actions.setPage({ number: 10, loading: true }), 'scopeForTest'),
          wrapAction(actions.setUsers({ 10: users }), 'scopeForTest'),
          wrapAction(actions.setRollups(rollups), 'scopeForTest'),
          wrapAction(actions.setPage({ number: 10, loading: false }), 'scopeForTest')
        ])
        return null
      })
    })

    it('will not change to a new page until the prior page has loaded', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 5, loading: true }, users: { 1: [], 2: [] } }
        }
      }
      const store = createMockStore(fromJS(state), service)

      return store.dispatch(actions.loadPage('quiz', 101, 2)).then(() => {
        expect(store.getActions()).to.deep.equal([])
        return null
      })
    })

    it('dispatches setUsers / setPageData on outcome service success', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1 }, users: { } }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadPage('quiz', 101, 2))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setUsers({2: getUsersResponse.users}))
          expect(store.getActions()).to.deep.include(scopedActions.setPageData({ perPage: 50, total: 2 }))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1 }, users: { 1: [] } }
        }
      }
      const error = { message: 'foo bar baz' }
      const service = { getUsers: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadPage('quiz', 101, 2))
        .then(() => {
          expect(store.getActions()).to.have.length(4)
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })

    it('dispatches an alternative loadUsers function if specified', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1 }, users: { 1: [] } }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const loadUsers = sinon.stub().returns(Promise.resolve())
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadPage('quiz', 101, 2, loadUsers))
        .then(() => {
          expect(service.getUsers).not.to.have.been.called
          expect(loadUsers).to.have.been.calledOnce
          return null
        })
    })
  })

  describe('loadUsers', () => {
    it('calls outcome service to load users', () => {
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadUsers())
        .then(() => {
          expect(service.getUsers).to.have.been.calledOnce
          return null
        })
    })
  })

  describe('loadRemainingPages', () => {
    it('starts loading remaining pages if we are not already loading them', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1, loading: false }, users: { 1: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingPages('quiz', 101))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setLoadingRemainingPages(IN_PROGRESS))
        })
    })

    it('does not load remaining pages if we are already loading them', () => {
      const state = {
        scopeForTest: {
          report: { loadingRemainingPages: IN_PROGRESS, page: { number: 1, loading: false }, users: { 1: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingPages('quiz', 101))
        .then(() => {
          expect(store.getActions()).not.to.deep.include(scopedActions.setLoadingRemainingPages(IN_PROGRESS))
        })
    })

    it('loads the remaining pages from the current page if there was an error while fetching last time', () => {
      const state = {
        scopeForTest: {
          report: { loadingRemainingPages: ERROR, page: { number: 1, loading: false }, users: { 1: users, 2: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingPages('quiz', 101))
        .then(() => {
          expect(service.getUsers).to.have.callCount(3)
        })
    })

    it('sets loadRemainingPages as fetching_error if an error is thrown while fetching users', () => {
      const state = {
        scopeForTest: {
          report: { loadingRemainingPages: NOT_FETCHING, page: { number: 1, loading: false }, users: { 1: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.reject({message: 'error!'})) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingPages('quiz', 101))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setLoadingRemainingPages(ERROR))
          expect(store.getActions()).not.to.deep.include(scopedActions.setLoadingRemainingPages(COMPLETED))
        })
    })

    it('sets loadRemainingPages as fetching_error if an error is thrown while fetching results', () => {
      const state = {
        scopeForTest: {
          report: { loadingRemainingPages: NOT_FETCHING, page: { number: 1, loading: false }, users: { 1: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = {
        getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)),
        getOutcomeResults: sinon.stub().returns(Promise.reject({message: 'error!'}))
      }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingPages('quiz', 101))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setLoadingRemainingPages(ERROR))
          expect(store.getActions()).not.to.deep.include(scopedActions.setLoadingRemainingPages(COMPLETED))
        })
    })
  })

  describe('loadRemainingUsers', () => {
    it('calls outcomes service for each remaining page and sets the users', () => {
      const state = {
        scopeForTest: {
          report: { page: { number: 1, loading: false }, users: { 1: users } }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.resolve(getUsersResponse)) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingUsers('quiz', 101, 2, 3))
        .then(() => {
          expect(service.getUsers).to.have.been.calledTwice
          expect(store.getActions()).to.deep.include(scopedActions.setUsers({ 1: users, 2: getUsersResponse.users }))
          expect(store.getActions()).to.deep.include(scopedActions.setUsers({ 1: users, 3: getUsersResponse.users }))
        })
    })

    it('sets loadRemainingPages as fetching_error if an error is thrown while fetching', () => {
      const state = {
        scopeForTest: {
          report: { loadingRemainingPages: IN_PROGRESS, page: { number: 1, loading: false }, users: { 1: users }, pageData: { total: 6, perPage: 2}, rollups: rollups }
        }
      }
      const service = { getUsers: sinon.stub().returns(Promise.reject({message: 'error!'})) }
      const store = createMockStore(fromJS(state), service)
      return store.dispatch(actions.loadRemainingUsers('quiz', 101, 2, 3))
        .then(() => {
          expect(store.getActions()).to.deep.include(scopedActions.setLoadingRemainingPages(ERROR))
        })
    })
  })

  describe('loadRemainingResults', () => {
    it('calls outcome service for each remaining page and rollups and sets the results', () => {
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { 1: users }, rollups: rollups } } }
      const store = createMockStore(Map(fromJS(state)), service)
      return store.dispatch(actions.loadRemainingResults('quiz', 101, 2, 3))
        .then(() => {
          const resultActions = store.getActions().slice(-5)
          const completeAction = resultActions.pop()
          resultActions.forEach((act) => {
            const { outcomeId, seenResults } = act.payload
            const results = fakeResults[outcomeId]
            expect(act).to.deep.equal(scopedActions.setResults({ outcomeId, results, seenResults }))
          })
          expect(completeAction).to.deep.equal(scopedActions.setLoadingRemainingPages(COMPLETED))
        })
    })
  })

  describe('getUserList', () => {
    it('returns a list of user uuids from page 1', () => {
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { 1: users, 2: getUsersResponse.users }, rollups: rollups } } }
      expect(actions.getUserList(fromJS(state), 'scopeForTest', 1)).to.deep.eq(users.map((user) => user.uuid))
    })

    it('returns a list of user uuids from page 2', () => {
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { 1: users, 2: getUsersResponse.users }, rollups: rollups } } }
      expect(actions.getUserList(fromJS(state), 'scopeForTest', 2)).to.deep.eq(getUsersResponse.users.map((user) => user.uuid))
    })
  })

  describe('getPaginatedUserList', () => {
    it('returns a paginated list of all users', () => {
      const users1 = users.map((user) => user.uuid)
      const users2 = getUsersResponse.users.map((user) => user.uuid)
      const allUsers = [users1, users2]
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { 1: users, 2: getUsersResponse.users }, rollups: rollups } } }
      expect(actions.getPaginatedUserList(fromJS(state), 'scopeForTest', 1, 2)).to.deep.eq(allUsers)
    })

    it('returns a paginated list of a subset of users', () => {
      const users2 = getUsersResponse.users.map((user) => user.uuid)
      const users3 = users.map((user) => user.uuid)
      const allUsers = [users2, users3]
      const state = { scopeForTest: { report: { page: { number: 0 }, users: { 1: users, 2: getUsersResponse.users, 3: users }, rollups: rollups } } }
      expect(actions.getPaginatedUserList(fromJS(state), 'scopeForTest', 2, 3)).to.deep.eq(allUsers)
    })
  })
})
