import { expect } from 'chai'
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
      expect(getConfig(state, 'scopeForTest')).to.deep.equal({ foo: 'bar' })
    })

    it('returns an empty object if no config present', () => {
      expect(getConfig(Map(), 'scopeForTest')).to.deep.equal({})
    })
  })
})
