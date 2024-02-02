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

  getAlignments (host, jwt, alignmentSetId, contextUuid) {
    if (!alignmentSetId) {
      return Promise.resolve([])
    }

    let params = 'includes[]=outcomes&includes[]=friendly_description&includes[]=source_context_name'

    if (contextUuid) {
      params += `&context_uuid=${contextUuid}`
    }

    return this.get(host, jwt, `/api/alignment_sets/${alignmentSetId}?${params}`)
      .then(checkResponse)
      .then(toJson)
      .then((json) => (json.alignment_set || json))
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

  createAlignmentSet (host, jwt, outcomeIds) {
    if (!outcomeIds.length) {
      return Promise.resolve({guid: null})
    }

    const params = {
      outcome_ids: outcomeIds,
      includes: ['outcomes', 'source_context_name']
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
