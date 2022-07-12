/* eslint-disable promise/always-return */
import { expect } from 'chai'
import fetchMock from 'fetch-mock'
import OutcomesService from '../OutcomesService'

describe('OutcomesService', () => {
  const host = 'http://outcomes.docker'
  const jwt = 'wonderland'
  const subject = new OutcomesService()

  afterEach(() => {
    fetchMock.restore()
  })

  const mockGet = (path, response) => {
    fetchMock.getOnce(host + path, response)
  }

  describe('loadOutcomes', () => {
    it('resolves with normalized json on success', () => {
      const serverResponse = {
        outcome_tree: {
          root_ids: [1, 2],
          outcomes: [
            { id: 1, child_ids: [] },
            { id: 2, child_ids: [3] },
            { id: 3, child_ids: [4] },
            { id: 4, child_ids: [] }
          ]
        }
      }
      mockGet('/api/outcomes/tree?excludes[]=scoring_method&depth=2&includes[]=friendly_description', serverResponse)
      return subject.loadOutcomes(host, jwt)
        .then((result) => {
          expect(result).to.deep.equal(serverResponse.outcome_tree)
        })
    })

    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcomes\/tree\?excludes\[\]=scoring_method&depth=2&context_uuid=alphabeta&includes\[\]=friendly_description$/)
        return true
      }, [])
      return subject.loadOutcomes(host, jwt, 'alphabeta')
    })

    it('adds includes friendly description with blank context', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcomes\/tree\?excludes\[\]=scoring_method&depth=2&includes\[\]=friendly_description$/)
        return true
      }, [])
      return subject.loadOutcomes(host, jwt, '')
    })

    it('supports specifying roots', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/roots\[\]=4&roots\[\]=5/)
        return true
      }, [])
      return subject.loadOutcomes(host, jwt, 'alphabeta', [4, 5])
    })

    it('rejects on error', () => {
      mockGet('/api/outcomes/tree?excludes[]=scoring_method&depth=2&includes[]=friendly_description', 500)
      return subject.loadOutcomes(host, jwt)
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('getOutcome', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcomes\/1\?includes\[\]=friendly_description&context_uuid=alphabeta$/)
        return true
      }, [])
      return subject.getOutcome(host, jwt, '1', 'alphabeta')
    })

    it('uses correct query with blank context', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcomes\/1\?includes\[\]=friendly_description$/)
        return true
      }, [])
      return subject.getOutcome(host, jwt, '1', '')
    })

    it('resolves with json on success', () => {
      const outcome = {
        id: 1,
        scoring_method: {
        }
      }
      mockGet('/api/outcomes/1?includes[]=friendly_description&context_uuid=alphabeta', outcome)
      return subject.getOutcome(host, jwt, '1', 'alphabeta')
        .then((result) => {
          expect(result).to.deep.equal(outcome)
        })
    })

    it('rejects on error', () => {
      mockGet('/api/outcomes/1?includes[]=friendly_description&context_uuid=alphabeta', 500)
      return subject.getOutcome(host, jwt, '1', 'alphabeta')
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('getAlignments', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/alignment_sets\/foo\?includes\[\]=outcomes&includes\[\]=friendly_description&context_uuid=alphabeta$/)
        return true
      }, [])
      return subject.getAlignments(host, jwt, 'foo', 'alphabeta')
    })

    it('resolves with json on success', () => {
      const alignments = {
        alignment_set: {
          guid: 'xyz',
          alignments: [
            { id: 1, outcome_id: 10 },
            { id: 2, outcome_id: 20 }
          ]
        }
      }
      mockGet('/api/alignment_sets/baz?includes[]=outcomes&includes[]=friendly_description&context_uuid=alphabeta', alignments)
      return subject.getAlignments(host, jwt, 'baz', 'alphabeta')
        .then((result) => {
          expect(result).to.deep.equal(alignments.alignment_set)
        })
    })

    it('rejects on error', () => {
      mockGet('/api/alignment_sets/foo?includes[]=outcomes&includes[]=friendly_description&context_uuid=alphabeta', 500)
      return subject.getAlignments(host, jwt, 'foo', 'alphabeta')
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('getArtifact', () => {
    const artifact = {
      artifact_id: '1',
      artifact_type: 'quizzes.quiz',
      alignment_set: {
        guid: 'xyz',
        outcomes: [
          { id: 1, outcome_id: 10 },
          { id: 2, outcome_id: 20 }
        ]
      }
    }
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/artifact\?artifact_id=1&artifact_type=quizzes.quiz$/)
        return true
      }, [])
      return subject.getArtifact(host, jwt, artifact.artifact_type, artifact.artifact_id)
    })

    it('resolves with json on success', () => {
      mockGet('/api/artifact?artifact_id=1&artifact_type=quizzes.quiz', artifact)
      return subject.getArtifact(host, jwt, artifact.artifact_type, artifact.artifact_id)
        .then((result) => {
          expect(result).to.deep.equal(artifact.alignment_set)
        })
    })

    it('rejects on error', () => {
      mockGet('/api/artifact?artifact_id=1&artifact_type=quizzes.quiz', 500)
      return subject.getArtifact(host, jwt, artifact.artifact_type, artifact.artifact_id)
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('upsertArtifact', () => {
    it('posts data in correct format', () => {
      fetchMock.postOnce((_url, opts) => {
        const body = JSON.parse(opts.body)
        expect(body).to.deep.equal({ artifact_type: 'type',artifact_id: 'id', context_uuid: 'context', outcome_ids: [44, 99] })
        return true
      }, {})
      return subject.upsertArtifact(host, jwt, 'type', 'id', 'context', [44, 99])
    })

    it('resolves on success', () => {
      const payload = {
        artifactId: '1',
        artifactType: 'quizzes.quiz',
        contextUuid: 'context_uuid',
        outcomeIds: ['1', '2']
      }

      const response = {
        alignment_set: {
          guid: 'foo',
          outcomes: [
            { id: 1, outcome_id: 10 },
            { id: 2, outcome_id: 20 }
          ]
        }
      }
      fetchMock.postOnce('http://outcomes.docker/api/artifacts', {
        status: 201,
        body: { ...response }
      })
      return subject.upsertArtifact(host, jwt, payload.artifactType, payload.artifactId, payload.contextUuid, payload.outcomeIds)
        .then(result => expect(result).to.deep.equal(response.alignment_set))
    })


    it('rejects on error', () => {
      fetchMock.postOnce('http://outcomes.docker/api/artifacts', 500)
      return subject.upsertArtifact(host, jwt, 'type', 'id', 'context', [1, 2, 3])
        .catch(err => expect(err).to.have.property('status', 500))
    })

    it('resolves with an empty guid when there are no outcomes', () => {
      const payload = {
        artifactType: 'quizzes.quiz',
        artifactId: '1',
        contextUuid: 'context_uuid',
        outcomeIds: []
      }
      fetchMock.postOnce('http://outcomes.docker/api/artifacts', {
        status: 201,
        body: {} // a delete (caused by having no outcomeIds) returns nothing
      })
      return subject.upsertArtifact(host, jwt, payload.artifactType, payload.artifactId, payload.contextUuid, payload.outcomeIds)
        .then(result => expect(result).to.deep.equal({guid: null}))
    })
  })

  describe('createAlignmentSet', () => {
    it('posts data in correct format', () => {
      fetchMock.postOnce((url, opts) => {
        const body = JSON.parse(opts.body)
        expect(body).to.deep.equal({ outcome_ids: [44, 99] })
        return true
      }, {})
      return subject.createAlignmentSet(host, jwt, [44, 99])
    })

    it('resolves on success', () => {
      fetchMock.postOnce('http://outcomes.docker/api/alignment_sets', {
        status: 201,
        body: {
          alignment_set: {
            guid: 'foo'
          }
        }
      })
      return subject.createAlignmentSet(host, jwt, [1, 2, 3])
        .then((result) => {
          expect(result).to.deep.equal({ guid: 'foo' })
        })
    })

    it('resolves on empty alignment set', () => {
      return subject.createAlignmentSet(host, jwt, [])
        .then((result) => {
          expect(result).to.deep.equal({ guid: null })
        })
    })

    it('rejects on error', () => {
      fetchMock.postOnce('http://outcomes.docker/api/alignment_sets', 500)
      return subject.createAlignmentSet(host, jwt, [1, 2, 3])
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('getOutcomeRollups', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcome_rollups\?artifact_id=21&artifact_type=quiz$/)
        return true
      }, [])
      return subject.getOutcomeRollups(host, jwt, 'quiz', 21)
    })

    it('resolves with json on success', () => {
      const rollups = {
        outcome_rollups: [
          {
            count: 100,
            mastery_count: 11,
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
          }
        ]
      }
      fetchMock.getOnce('http://outcomes.docker/api/outcome_rollups?artifact_id=16&artifact_type=quiz', rollups)
      return subject.getOutcomeRollups(host, jwt, 'quiz', 16)
        .then((result) => {
          expect(result).to.deep.equal(rollups.outcome_rollups)
        })
    })

    it('rejects on error', () => {
      fetchMock.getOnce('http://outcomes.docker/api/outcome_rollups?artifact_id=50&artifact_type=quiz', 400)
      return subject.getOutcomeRollups(host, jwt, 'quiz', 50)
        .catch((err) => {
          expect(err).to.have.property('status', 400)
        })
    })
  })

  describe('getOutcomeResults', () => {
    it('resolves with json on success', () => {
      const results = {
        results: [
          { user_uuid: 'bc5c4f0e-bfbb-46a7-98f3-1ee8c86a1c6f', points: 30.0, points_possible: 40.0 },
          { user_uuid: '560fddd9-9b16-4e3a-969c-2f095e7afc78', points: 80.0, points_possible: 100.0 }
        ]
      }
      const userList = results.results.map((user) => user.user_uuid)
      /* eslint-disable max-len */
      fetchMock.getOnce(
        /http:\/\/outcomes.docker\/api\/authoritative_results\?artifact_id=16&artifact_type=quiz&outcome_id=1985&user_uuid_list=.*/,
        results
      )
      return subject.getOutcomeResults(host, jwt, 'quiz', 16, 1985, userList)
        .then((result) => {
          expect(result).to.deep.equal(results.results)
        })
    })

    it('rejects on error', () => {
      fetchMock.getOnce(
        /http:\/\/outcomes.docker\/api\/authoritative_results\?artifact_id=16&artifact_type=quiz&outcome_id=1985&user_uuid_list=.*/,
        400
      )
      return subject.getOutcomeResults(host, jwt, 'quiz', 16, 1985, [])
        .catch((err) => {
          expect(err).to.have.property('status', 400)
        })
    })
  })

  describe('getUsers', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/users\?artifact_id=21&artifact_type=quiz$/)
        return true
      }, [])
      return subject.getUsers(host, jwt, 'quiz', 21)
    })

    it('resolves with json and page info on success', () => {
      const page = 1
      const perPage = 50
      const total = 499
      const results = [
        { uuid: 'bc5c4f0e-bfbb-46a7-98f3-1ee8c86a1c6f' },
        { uuid: '560fddd9-9b16-4e3a-969c-2f095e7afc78' }
      ]
      const response = { body: results, headers: {'Per-Page': perPage, Total: total} }
      const expected = {
        users: results,
        page,
        perPage,
        total
      }
      fetchMock.getOnce(
        'http://outcomes.docker/api/users?artifact_id=16&artifact_type=quiz&page=1',
        response
      )
      return subject.getUsers(host, jwt, 'quiz', 16, page)
        .then((result) => {
          expect(result).to.deep.equal(expected)
        })
    })

    it('rejects on error', () => {
      fetchMock.getOnce(
        'http://outcomes.docker/api/users?artifact_id=16&artifact_type=quiz&page=1',
        400
      )
      return subject.getUsers(host, jwt, 'quiz', 16, 1)
        .catch((err) => {
          expect(err).to.have.property('status', 400)
        })
    })
  })

  describe('getIndividualResults', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/individual_results\?artifact_id=21&artifact_type=quiz&includes\[\]=outcomes&includes\[\]=outcome_rollups&user_uuid=userId$/)
        return true
      }, [])
      return subject.getIndividualResults(host, jwt, 'quiz', 21, 'userId')
    })

    it('resolves with json and page info on success', () => {
      const results = {
        results: []
      }
      const response = { body: results }
      fetchMock.getOnce('http://outcomes.docker/api/individual_results?artifact_id=21&artifact_type=quiz&includes[]=outcomes&includes[]=outcome_rollups&user_uuid=userId', response)
      return subject.getIndividualResults(host, jwt, 'quiz', 21, 'userId')
        .then((result) => {
          expect(result).to.deep.equal([])
        })
    })

    it('rejects on error', () => {
      fetchMock.getOnce('http://outcomes.docker/api/individual_results?artifact_id=21&artifact_type=quiz&includes[]=outcomes&includes[]=outcome_rollups&user_uuid=userId', 400)
      return subject.getIndividualResults(host, jwt, 'quiz', 21, 'userId')
        .catch((err) => {
          expect(err).to.have.property('status', 400)
        })
    })
  })

  describe('getSearchResults', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        expect(url).to.match(/\/outcomes\/search\?context_uuid=def&includes\[\]=scoring_method&includes\[\]=friendly_description&page=999&text=abc$/)
        return true
      }, [])
      return subject.getSearchResults(host, jwt, 'abc', 999, 'def')
    })

    it('resolves with json on success', () => {
      const body = {
        matches: [{ id: 1 }],
        outcomes: [
          { id: 1, title: 'abc', label: '123' },
          { id: 2, title: 'foo', label: 'bar' }
        ]
      }
      const headers = {
        total: 101
      }
      mockGet('/api/outcomes/search?context_uuid=def&includes[]=scoring_method&includes[]=friendly_description&page=999&text=abc', { body, headers })
      return subject.getSearchResults(host, jwt, 'abc', 999, 'def')
        .then((result) => {
          expect(result).to.deep.equal({...body, total: 101})
        })
    })

    it('rejects on error', () => {
      mockGet('/api/outcomes/search?context_uuid=def&includes[]=scoring_method&includes[]=friendly_description&page=999&text=abc', 500)
      return subject.getSearchResults(host, jwt, 'abc', 999, 'def')
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })
  })

  describe('listOutcomes', () => {
    it('uses correct query', () => {
      fetchMock.getOnce((url, opts) => {
        const exp_url = /\/outcomes\/list\?artifact_id=103&artifact_type=quizzes\.quiz&context_uuid=def&includes\[\]=scoring_method&includes\[\]=friendly_description&page=999&per_page=10$/
        expect(url).to.match(exp_url)
        return true
      }, [])
      return subject.listOutcomes(host, jwt, 999, 'def', '103', 'quizzes.quiz' )
    })

    it('resolves with json on success', () => {
      const body = [
        { id: 1, title: 'abc', label: '123' },
        { id: 2, title: 'foo', label: 'bar' }
      ]
      const headers = {
        total: 101
      }
      const url = '/api/outcomes/list?context_uuid=def&includes[]=scoring_method&includes[]=friendly_description&page=999&per_page=10'
      mockGet(url, { body, headers })
      return subject.listOutcomes(host, jwt, 999, 'def')
        .then((result) => {
          expect(result).to.deep.equal({outcomes: body, total: 101})
        })
    })

    it('rejects on error', () => {
      const url = '/api/outcomes/list?artifact_id=103&artifact_type=quizzes.quiz&context_uuid=def&includes[]=scoring_method&includes[]=friendly_description&page=999&per_page=10'
      mockGet(url, 500)
      return subject.listOutcomes(host, jwt, 999, 'def', '103', 'quizzes.quiz')
        .catch((err) => {
          expect(err).to.have.property('status', 500)
        })
    })

    it('resolves with json on success when artifact is specified', () => {
      const body = [
        { id: 1, title: 'abc', label: '123' },
        { id: 2, title: 'foo', label: 'bar' }
      ]
      const headers = {
        total: 101
      }
      const url = '/api/outcomes/list?artifact_id=103&artifact_type=quizzes.quiz&context_uuid=def&includes[]=scoring_method&includes[]=friendly_description&page=999&per_page=10'
      mockGet(url, { body, headers })
      return subject.listOutcomes(host, jwt, 999, 'def', '103', 'quizzes.quiz')
        .then((result) => {
          expect(result).to.deep.equal({outcomes: body, total: 101})
        })
    })
  })
})
