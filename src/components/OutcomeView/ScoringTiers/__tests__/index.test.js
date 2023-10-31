import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import { IconEmptyLine, IconStarSolid } from '@instructure/ui-icons'
import ScoringTiers from '../index'
import checkA11y from '../../../../test/checkA11y'

import styles from '../styles'
// import { find } from 'lodash'
import { findElementsWithStyle } from '../../../../util/__tests__/findElementsWithStyle'
import generateComponentTheme from '../../../theme'

describe('OutcomeView ScoringTiers', () => {
  const scoringMethod = {
    id: 1,
    description: 'Some Method',
    points_possible: 5,
    mastery_percent: 0.6,
    algorithm: 'highest',
    algorithm_data: {}
  }

  const outcomeResult = {
    childArtifactCount: 0,
    masteryCount: 0,
    count: 0,
    averageScore: 0.6,
    outcomeId: 'foo'
  }

  const scoringTiers = [
    { id: 1, description: 'Cri 1', percent: 1.0 },
    { id: 2, description: 'Cri 2', percent: 0.6 },
    { id: 3, description: 'Cri 3', percent: 0.22222222 }
  ]

  function makeProps (props = {}) {
    return Object.assign({
      scoringMethod,
      scoringTiers,
    }, props)
  }

  it('displays scoring tiers', () => {
    const wrapper = mount(<ScoringTiers {...makeProps()} />)
    expect(findElementsWithStyle(wrapper, styles(generateComponentTheme).rating)).to.have.length(scoringTiers.length)
  })

  const nextScore = (pillWrapper, wrapper) => {
    const gapNode = pillWrapper.closest('.outcomeViewGap').instance()
    const tierNode = gapNode.nextSibling
    const score = tierNode ? tierNode.getElementsByClassName('outcomeViewScore')[0].innerText : null
    return score
  }

  it('shows mastery between correct tiers', () => {
    const wrapper = mount(<ScoringTiers {...makeProps()} />)
    const mastery = wrapper.find(IconStarSolid)
    const score = nextScore(mastery, wrapper)
    expect(score).to.equal('1.11')
  })

  it('shows average between the correct tiers', () => {
    const props = makeProps({
      outcomeResult: {
        ...outcomeResult,
        averageScore: 0.99
      }
    })
    const wrapper = mount(<ScoringTiers {...props} />)
    const average = wrapper.find(IconEmptyLine)
    const score = nextScore(average)
    expect(score).to.equal('3')
  })

  it('shows mastery above average if they are equal', () => {
    const props = makeProps({
      outcomeResult: {
        averageScore: 0.6,
        ...outcomeResult
      }
    })
    const wrapper = mount(<ScoringTiers {...props} />)
    const gap = wrapper.find(IconStarSolid).closest('.outcomeViewGap')
    expect(gap.childAt(0).find('span').at(0).hasClass('outcomeViewMastery')).to.be.true
    expect(gap.childAt(1).find('span').at(0).hasClass('outcomeViewAverage')).to.be.true

  })

  it('rounds mastery points', () => {
    const props = makeProps()
    const wrapper = mount(<ScoringTiers {...props} />)
    const rating = findElementsWithStyle(wrapper, styles(generateComponentTheme).rating).last()
    const score =  findElementsWithStyle(rating, styles(generateComponentTheme).score)
    expect(score.text()).to.equal('1.11')
  })

  it('renders tier mastery count', () => {
    const props = makeProps({
      scoringTiers: [
        { id: 1, description: 'Cri 1', percent: 1.0, count: 10 }
      ]
    })
    const wrapper = mount(<ScoringTiers {...props} />)
    const txt = findElementsWithStyle(wrapper, styles(generateComponentTheme).masteryCount).find('Text')
    expect(txt.first().text()).to.match(/Students/)
  })

  it('meets a11y standards', () => {
    return checkA11y(<ScoringTiers {...makeProps()} />)
  })
})
