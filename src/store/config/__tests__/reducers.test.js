import { Map } from 'immutable'
import { expect, describe, it } from '@jest/globals'
import reducerFactory from '../reducers'

describe('config/reducers', () => {
  describe('config', () => {
    it('remains constant', () => {
      const reducer = reducerFactory({ host: 'myhost', jwt: 'myjwt' })
      const newState = reducer(Map(), { type: 'foo', payload: 'bar' })
      expect(newState.get('host')).toBe('myhost')
      expect(newState.get('jwt')).toBe('myjwt')
    })
  })
})
