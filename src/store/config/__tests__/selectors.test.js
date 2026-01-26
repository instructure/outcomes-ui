import { expect, describe, it } from '@jest/globals'
import { fromJS, Map } from 'immutable'
import { getConfig } from '../selectors'

describe('context/selectors', () => {
  const state = fromJS({
    scopeForTest: {
      config: {
        foo: 'bar'
      }
    }
  })

  describe('getConfig', () => {
    it('retrieves the correct value', () => {
      expect(getConfig(state, 'scopeForTest')).toEqual({ foo: 'bar' })
    })

    it('returns an empty object if no config present', () => {
      expect(getConfig(Map(), 'scopeForTest')).toEqual({})
    })
  })
})
