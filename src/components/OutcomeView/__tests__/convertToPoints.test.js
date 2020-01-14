import { expect } from 'chai'
import convertToPoints from '../convertToPoints'

describe('OutcomeView convertToPoints', () => {
  it('computes from percent and scoring method', () => {
    const scoringMethod = { points_possible: 20 }
    expect(convertToPoints(0.7, scoringMethod)).to.equal(14)
    expect(convertToPoints(0.2, scoringMethod)).to.equal(4)
    expect(convertToPoints(1.1, scoringMethod)).to.equal(22)
  })

  it('returns null if scoring method not defined', () => {
    expect(convertToPoints(5, null)).to.be.undefined
  })

  it('rounds to two decimal places', () => {
    const scoringMethod = { points_possible: 3 }
    expect(convertToPoints(0.1111, scoringMethod)).to.equal(0.33)
  })
})
