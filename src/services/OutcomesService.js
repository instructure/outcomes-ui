import 'isomorphic-fetch'
import queryString from 'query-string'

const OUTCOME_QUERY_DEPTH = 2

const checkResponse = (response) => {
  if (!response.ok) {
    throw response
  }
  return response
}

const toJson = (response) => {
  return response.json()
}

const getTotal = (response) => {
  const total = response.headers.get('total')
  return total ? Number.parseInt(total) : 0
}

const SUB_ACCOUNT_OUTCOME = 'SUB_ACCOUNT_OUTCOME'
const NOT_IN_SUB_ACCOUNT = 'NOT_IN_SUB_ACCOUNT'
const COURSE_OUTCOME = 'COURSE_OUTCOME'
const NOT_IN_COURSE = 'NOT_IN_COURSE'
const HIDE = 'HIDE'

const DECORATOR_SORT_ORDER = {
  null: 0,
  undefined: 0,
  SUB_ACCOUNT_OUTCOME: 1,
  NOT_IN_SUB_ACCOUNT: 2,
  COURSE_OUTCOME: 3,
  NOT_IN_COURSE: 4,
  HIDE: 5
}

const byDecorator = (o1, o2) => {
  const d1 = DECORATOR_SORT_ORDER[o1.decorator]
  const d2 = DECORATOR_SORT_ORDER[o2.decorator]

  if (d1 < d2) {
    return -1
  } else if (d1 > d2) {
    return 1
  }
  return 0
}

/* eslint-disable no-param-reassign */
const  decorateAlignments = (alignmentSet, launchContext, isLaunchingFromRootAccount) => {
  const outcomes = alignmentSet.outcomes
  if(!launchContext || !outcomes) {
    return alignmentSet
  }
  outcomes.forEach((outcome) => {
    if (isLaunchingFromRootAccount) {
      // No need to decorate if outcome is in root account
      if (!outcome.in_launch_context) {
        switch (outcome.source_context_info?.context_type) {
          case 'course':
            outcome.decorator = COURSE_OUTCOME
            break
          case 'account':
            outcome.decorator = SUB_ACCOUNT_OUTCOME
            break
        }
      }
    } else if (outcome.launch_context_type === 'account') {
      // No need to decorate if outcome is in the sub-account
      if (!outcome.in_launch_context) {
        switch (outcome.source_context_info?.context_type) {
          case 'course':
            outcome.decorator = COURSE_OUTCOME
            break
          case 'account':
            outcome.decorator = NOT_IN_SUB_ACCOUNT
            break
        }
      }
    } else if (outcome.launch_context_type === 'course') {
      // No need to decorate if outcome is in the course
      if (!outcome.in_launch_context) {
        switch (outcome.source_context_info?.context_type) {
          case 'course':
            outcome.decorator = HIDE
            break
          case 'account':
            outcome.decorator = NOT_IN_COURSE
            break
        }
      }
    }
  })

  // Now that the outcomes are populated with the decorator, sort by title then sort by decorator.
  // The various components will need to filter out those that are hidden, but they need to be
  // returned and stored in the redux store to prevent them from getting unaligned when the
  // alignment set is mutated.
  alignmentSet.outcomes = outcomes.sort((a, b) => {
    const titleA = (a && a.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    const titleB = (b && b.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    return titleA.localeCompare(titleB)
  }).sort(byDecorator)
  return alignmentSet
}
/* eslint-enable no-param-reassign */

class OutcomesService {
  get (host, jwt, path) {
    return fetch(host + path, {
      headers: {
        Authorization: jwt
      }
    })
  }

  post (host, jwt, path, body) {
    return fetch(host + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(body)
    })
  }

  getContext (host, jwt, contextUuid) {
    const params = '?includes[]=outcome_proficiency&includes[]=outcome_calculation_method'

    return this.get(host, jwt, `/api/contexts/${contextUuid}${params}`)
      .then(checkResponse)
      .then(toJson)
  }

  loadOutcomes (host, jwt, contextUuid = '', roots = null) {
    let params = `?excludes[]=scoring_method&depth=${OUTCOME_QUERY_DEPTH}`
    if (contextUuid) {
      params += `&${queryString.stringify({
        context_uuid: contextUuid
      })}`
    }
    params += '&includes[]=friendly_description'
    if (roots) {
      params += `&${queryString.stringify({ roots: roots }, { arrayFormat: 'bracket' })}`
    }
    return this.get(host, jwt, `/api/outcomes/tree${params}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.outcome_tree || json))
  }

  getOutcome (host, jwt, id, contextUuid) {
    let params = '?includes[]=friendly_description'
    if (contextUuid) {
      params += `&${queryString.stringify({
        context_uuid: contextUuid
      })}`
    }
    return this.get(host, jwt, `/api/outcomes/${id}${params}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => json)
  }

  getAlignments (host, jwt, alignmentSetId, contextUuid, launchContext, isLaunchingFromRootAccount) {
    if (!alignmentSetId) {
      return Promise.resolve([])
    }

    let params = 'includes[]=outcomes&includes[]=friendly_description&includes[]=source_context_info'

    if (contextUuid) {
      params += `&context_uuid=${contextUuid}`
    }
    if (launchContext) {
      params += `&launch_context=${launchContext}`
    }

    return this.get(host, jwt, `/api/alignment_sets/${alignmentSetId}?${params}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => {
        return decorateAlignments(json.alignment_set || json, launchContext, isLaunchingFromRootAccount)
      })
  }

  getArtifact (host, jwt, artifactType, artifactId) {
    const params = { artifact_type: artifactType, artifact_id: artifactId, includes: 'friendly_description' }
    return this.get(host, jwt, `/api/artifact?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.alignment_set || json))
  }

  upsertArtifact (host, jwt, artifactType, artifactId, contextUuid, outcomeIds) {
    const params = {
      artifact_id: artifactId,
      artifact_type: artifactType,
      context_uuid: contextUuid,
      outcome_ids: outcomeIds
    }
    return this.post(host, jwt, '/api/artifacts', params)
      .then(checkResponse)
      .then(response => {
        if (!outcomeIds.length) {
          return Promise.resolve({guid: null})
        }
        return toJson(response)
      })
      .then((json) => (json.alignment_set || json))
  }

  createAlignmentSet (host, jwt, outcomeIds, launchContext, isLaunchingFromRootAccount) {
    if (!outcomeIds.length) {
      return Promise.resolve({guid: null})
    }

    const params = {
      outcome_ids: outcomeIds,
      includes: ['outcomes', 'source_context_info']
    }
    if (launchContext) {
      params.launch_context = launchContext
    }

    return this.post(host, jwt, '/api/alignment_sets', params)
      .then(checkResponse)
      .then(toJson)
      .then((json) => {
        return decorateAlignments(json.alignment_set || json, launchContext, isLaunchingFromRootAccount)
      })
  }

  getOutcomeRollups (host, jwt, artifactType, artifactId) {
    const params = { artifact_type: artifactType, artifact_id: artifactId }

    return this.get(host, jwt, `/api/outcome_rollups?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.outcome_rollups || json))
  }

  getOutcomeResults (host, jwt, artifactType, artifactId, outcomeId, userList) {
    const params = {
      artifact_type: artifactType,
      artifact_id: artifactId,
      outcome_id: outcomeId,
      user_uuid_list: userList.join(',')
    }

    return this.get(host, jwt, `/api/authoritative_results?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then(toJson)
      .then(json => json.results)
  }

  getUsers (host, jwt, artifactType, artifactId, page) {
    const params = {
      page,
      artifact_type: artifactType,
      artifact_id: artifactId
    }

    let response
    return this.get(host, jwt, `/api/users?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then(resp => (response = resp).json()) // eslint-disable-line no-return-assign
      .then((json) => ({
        users: json,
        page,
        total: parseInt(response.headers.get('total'), 10),
        perPage: parseInt(response.headers.get('per-page'), 10)
      }))
  }

  getIndividualResults (host, jwt, artifactType, artifactId, userUuid) {
    const params = {
      artifact_type: artifactType,
      artifact_id: artifactId,
      user_uuid: userUuid,
      includes: ['outcomes', 'outcome_rollups']
    }

    return this.get(host, jwt, `/api/individual_results?${queryString.stringify(params, { arrayFormat: 'bracket' })}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => json.results)
  }

  getFeatures (host, jwt) {
    return this.get(host, jwt, '/api/features')
      .then(checkResponse)
      .then(toJson)
  }

  listOutcomes (host, jwt, page, contextUuid = null, artifactId = null, artifactType = null) {
    const params = { per_page: 10, page, includes: ['scoring_method', 'friendly_description'] }
    if (contextUuid) {
      params['context_uuid'] = contextUuid
    }
    if (artifactId) {
      params['artifact_id'] = artifactId
    }
    if (artifactType) {
      params['artifact_type'] = artifactType
    }
    let total = 0
    return this.get(host, jwt, `/api/outcomes/list?${queryString.stringify(params, { arrayFormat: 'bracket' })}`)
      .then(checkResponse)
      .then((response) => {
        total = getTotal(response)
        return response
      })
      .then(toJson)
      .then((json) => ({ outcomes: json, total }))
  }

  getSearchResults (host, jwt, text, page, contextUuid = '') {
    const params = { text, page, includes: ['scoring_method', 'friendly_description'] }
    if (contextUuid) {
      params['context_uuid'] = contextUuid
    }
    let total = 0
    return this.get(host, jwt, `/api/outcomes/search?${queryString.stringify(params, { arrayFormat: 'bracket' })}`)
      .then(checkResponse)
      .then((response) => {
        total = getTotal(response)
        return response
      })
      .then(toJson)
      .then((json) => {
        return Promise.resolve({...json, total})
      })
  }
}

export default OutcomesService
