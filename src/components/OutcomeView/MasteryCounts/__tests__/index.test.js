import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import MasteryCounts from '../index'
import checkA11y from '../../../../test/checkA11y'

describe('OutcomeView MasteryCounts', () => {
  const scoringMethod = {
    id: 1,
    description: 'Some Method',
    points_possible: 5,
    mastery_percent: 0.6,
    algorithm: 'highest',
    algorithm_data: {}
  }

  function makeProps (props = {}) {
    return Object.assign({
      scoringMethod,
      outcomeResult: {
        masteryCount: 10,
        count: 20
      }
    }, props)
  }

  it('includes a progress bar', () => {
    const wrapper = mount(<MasteryCounts {...makeProps()} />)
    expect(wrapper.find('Progress')).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<MasteryCounts {...makeProps()} />)
  })
})
