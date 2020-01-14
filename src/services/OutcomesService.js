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

  loadOutcomes (host, jwt, contextUuid = '', roots = null) {
    let params = `?excludes[]=scoring_method&depth=${OUTCOME_QUERY_DEPTH}`
    if (contextUuid) {
      params += `&${queryString.stringify({
        context_uuid: contextUuid
      })}`
    }
    if (roots) {
      params += `&${queryString.stringify({ roots: roots }, { arrayFormat: 'bracket' })}`
    }
    return this.get(host, jwt, `/api/outcomes/tree${params}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.outcome_tree || json))
  }

  getOutcome (host, jwt, id) {
    return this.get(host, jwt, `/api/outcomes/${id}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => json)
  }

  getAlignments (host, jwt, alignmentSetId) {
    if (!alignmentSetId) {
      return Promise.resolve([])
    }

    const params = {
      includes: ['outcomes']
    }
    return this.get(host, jwt, `/api/alignment_sets/${alignmentSetId}?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.alignment_set || json))
  }

  createAlignmentSet (host, jwt, outcomeIds) {
    if (!outcomeIds.length) {
      return Promise.resolve({guid: null})
    }

    const params = {
      outcome_ids: outcomeIds
    }

    return this.post(host, jwt, '/api/alignment_sets', params)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.alignment_set || json))
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

  listOutcomes (host, jwt, contextUuid = '') {
    let params = `?&per_page=10`
    if (contextUuid) {
      params += `&${queryString.stringify({
        context_uuid: contextUuid
      })}`
    }
    return this.get(host, jwt, `/api/outcomes/list${params}`)
      .then(checkResponse)
      .then(toJson)
  }

  getSearchResults (host, jwt, text, page, contextUuid = '') {
    let params = {
      text,
      page
    }
    if (contextUuid) {
      params['context_uuid'] = contextUuid
    }
    let total = 0
    return this.get(host, jwt, `/api/outcomes/search?${queryString.stringify(params)}`)
      .then(checkResponse)
      .then((response) => {
        total = response.headers.get('total')
        if (total) {
          total = Number.parseInt(total)
        }
        return response
      })
      .then(toJson)
      .then((json) => {
        return Promise.resolve({...json, total})
      })
  }
}

export default OutcomesService
