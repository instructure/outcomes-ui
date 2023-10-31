import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { IconStarSolid } from '@instructure/ui-icons'
import Score from '../index'
import checkA11y from '../../../../test/checkA11y'

describe('OutcomesPerStudent/Score', () => {
  function makeProps () {
    return {
      score: {
        percentScore: 0.5,
        points: 5,
        pointsPossible: 10
      },
      outcome: {
        scoring_method: {
          mastery_percent: 0.4
        }
      }
    }
  }

  it('includes the score', () => {
    const wrapper = mount(<Score {...makeProps()} />)
    expect(wrapper.text()).to.match(/5\/10/)
  })

  it('does not include the score if no score provided', () => {
    const noPoints = {
      score: null,
      outcome: {
        scoring_method: {
          mastery_percent: 0.4
        }
      }
    }
    const wrapper = mount(<Score {...noPoints} />)
    expect(wrapper.find('div[data-automation="outcomesPerStudent__score"]')).to.have.length(0)
  })

  it('includes a star if percentScore is greater than mastery', () => {
    const wrapper = mount(<Score {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconStarSolid)).to.have.length(1)
  })

  it('includes a star if percentScore is equal to mastery', () => {
    const props = makeProps()
    props.score.percentScore = 0.4 // eslint-disable-line immutable/no-mutation
    const wrapper = mount(<Score {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconStarSolid)).to.have.length(1)
  })

  it('does not include a star if percentScore is less than mastery', () => {
    const props = makeProps()
    props.score.percentScore = 0.1 // eslint-disable-line immutable/no-mutation
    const wrapper = shallow(<Score {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconStarSolid)).to.have.length(0)
  })

  it('meets a11y standards', () => {
    return checkA11y(<Score {...makeProps()} />)
  })
})
