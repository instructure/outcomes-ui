import { Map } from 'immutable'
import { expect } from 'chai'
import reducerFactory from '../reducers'

describe('config/reducers', () => {
  describe('config', () => {
    it('remains constant', () => {
      const reducer = reducerFactory({ host: 'myhost', jwt: 'myjwt' })
      const newState = reducer(Map(), { type: 'foo', payload: 'bar' })
      expect(newState.get('host')).to.equal('myhost')
      expect(newState.get('jwt')).to.equal('myjwt')
    })
  })
})
