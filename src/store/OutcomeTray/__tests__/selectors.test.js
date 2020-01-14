import { expect } from 'chai'
import { fromJS } from 'immutable'
import {
  getOutcomeList
} from '../selectors'

describe('OutcomeTray/selectors', () => {
  const state = fromJS({
    OutcomePicker: {
      tray: {
        list: []
      }
    }
  })

  describe('getOutcomeList', () => {
    it('returns the outcome list', () => {
      expect(getOutcomeList(state)).to.deep.equal([])
    })
  })
})
