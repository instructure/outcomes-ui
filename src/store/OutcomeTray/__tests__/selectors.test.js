import { expect } from 'chai'
import { fromJS } from 'immutable'
import {
  getOutcomeList,
  getListPage,
  getListTotal
} from '../selectors'

describe('OutcomeTray/selectors', () => {
  const scope = 'scopeForTest'
  const state = fromJS({
    scopeForTest: {
      config: {
        contextUuid: 'course_100'
      },
      OutcomePicker: {
        tray: {
          list: [],
          pagination: {
            page: 7,
            total: 100
          }
        }
      }
    }
  })

  describe('getOutcomeList', () => {
    it('returns the outcome list', () => {
      expect(getOutcomeList(state, scope)).to.deep.equal([])
    })
  })

  describe('getListPage', () => {
    it('returns the current page', () => {
      expect(getListPage(state, scope)).to.equal(7)
    })
  })

  describe('getListTotal', () => {
    it('returns the current total', () => {
      expect(getListTotal(state, scope)).to.equal(100)
    })
  })
})
