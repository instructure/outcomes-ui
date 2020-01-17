import { expect } from 'chai'
import { fromJS } from 'immutable'
import {
  getOutcomeList,
  getListPage,
  getListTotal
} from '../selectors'

describe('OutcomeTray/selectors', () => {
  const state = fromJS({
    OutcomePicker: {
      tray: {
        list: [],
        pagination: {
          page: 7,
          total: 100
        }
      }
    }
  })

  describe('getOutcomeList', () => {
    it('returns the outcome list', () => {
      expect(getOutcomeList(state)).to.deep.equal([])
    })
  })

  describe('getListPage', () => {
    it('returns the current page', () => {
      expect(getListPage(state)).to.equal(7)
    })
  })

  describe('getListTotal', () => {
    it('returns the current total', () => {
      expect(getListTotal(state)).to.equal(100)
    })
  })
})
