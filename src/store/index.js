import { createStore as reduxCreateStore, applyMiddleware, compose as reduxCompose } from 'redux'
import { combineReducers } from 'redux-immutable'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import serviceMiddleware from 'inst-redux-service-middleware'
import multireducer from 'multireducer/immutable'

import OutcomesService from '../services/OutcomesService'
import context from './context/reducers'
import config from './config/reducers'
import { loadFeatures } from './features/actions'
import features from './features/reducers'
import OutcomePicker from './OutcomePicker/reducers'
import alignments from './alignments/reducers'
import report from './report/reducers'
import StudentMastery from './StudentMastery/reducers'

/**
 * The outcomes redux store is shared between components on a page.
 * The shape has the form:
 *    OutcomePicker:
 *    context:
 *    quiz:::99:
 *      alignments
 *    question:::100:
 *      alignments
 *    ...
 *
 * When a new component retrieves the store using getStore,
 * its scope (artifactType:::artifactId) is added to the
 * store's shape via `dynamicReducers` if necessary.
 */

export function makeScope (artifactType, artifactId) {
  return `${artifactType}:::${artifactId}`
}

export function makeUserScope (artifactType, artifactId, userUuid) {
  if (userUuid === null) {
    return null
  }
  return `user::${artifactType}:${artifactId}:${userUuid}`
}

const dynamicReducers = {}

function createRootReducer () {
  return combineReducers({
    context,
    features,
    OutcomePicker,
    ...dynamicReducers
  })
}

function createStore () {
  const loggerMiddleware = createLogger({ stateTransformer: (state) => state.toJS() })
  const services = serviceMiddleware({ outcomes: new OutcomesService() })
  const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose

  const dev = process.env.NODE_ENV === 'development'
  const devMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware, services)
  const prodMiddleware = applyMiddleware(thunkMiddleware, services)
  const middleware = dev ? devMiddleware : prodMiddleware
  return reduxCreateStore(
    createRootReducer(),
    void 0,
    compose(middleware)
  )
}

function addScopeToStore (store, key, host, jwt, contextUuid) {
  if (!dynamicReducers[key]) {
    dynamicReducers[key] = multireducer(combineReducers({ // eslint-disable-line immutable/no-mutation
      config: config({ host, jwt, contextUuid }),
      alignments,
      report,
      StudentMastery
    }), key)
    store.replaceReducer(createRootReducer())
  }
  return store
}

function initializeStore (store, { host, jwt }) {
  store.dispatch(loadFeatures(host, jwt))
}

let store = null

export function getStore (host, jwt, key, contextUuid) {
  if (!store) {
    store = createStore()
    initializeStore(store, {host, jwt})
  }
  addScopeToStore(store, key, host, jwt, contextUuid)
  return store
}
