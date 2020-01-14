import { expect } from 'chai'
import React from 'react'
import { mount, shallow } from 'enzyme'
import OutcomeView from '../index'
import MasteryCounts from '../MasteryCounts'
import MasteryDescription from '../MasteryDescription'
import ScoringTiers from '../ScoringTiers'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeView', () => {
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
      description: 'My description',
      label: 'Foo',
      title: 'The rain in spain stays mainly...',
      scoringMethod,
      scoringTiers: [
        { id: 1, description: 'Cri 1', percent: 1.0 },
        { id: 2, description: 'Cri 2', percent: 0.6 },
        { id: 3, description: 'Cri 3', percent: 0.22222222 }
      ]
    }, props)
  }

  it('includes the title and description', () => {
    const wrapper = mount(<OutcomeView {...makeProps()} />)
    const text = wrapper.text()
    expect(text).to.match(/The rain in spain stays mainly\.\.\./)
    expect(text).to.match(/My description/)
  })

  it('sanitizes the description', () => {
    const props = makeProps({ description: 'The <blink>rain in Spain' })
    const wrapper = mount(<OutcomeView {...props} />)
    expect(wrapper.html()).to.include('</blink>')
  })

  it('includes counts if outcome result is defined', () => {
    const props = makeProps({
      outcomeResult: { count: 100, masteryCount: 50 }
    })
    const wrapper = shallow(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(MasteryCounts)).to.have.length(1)
  })

  it('does not include counts if outcome result not defined', () => {
    const wrapper = shallow(<OutcomeView {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(MasteryCounts)).to.have.length(0)
  })

  it('displays scoring tiers if scoring method and tiers defined', () => {
    const wrapper = shallow(<OutcomeView {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(ScoringTiers)).to.have.length(1)
  })

  it('displays does not display scoring tiers if tiers not defined', () => {
    const props = makeProps({ scoringTiers: null })
    const wrapper = shallow(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(ScoringTiers)).to.have.length(0)
  })

  it('renders mastery description if displayMasteryDescription is true and no artifactTypeName provided', () => {
    const props = makeProps({
      displayMasteryDescription: true
    })
    const wrapper = shallow(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    const scoreMastery = wrapper.find(MasteryDescription)
    expect(scoreMastery.length).to.equal(1)
  })

  it('does not render mastery description if displayMasteryDescription is false', () => {
    const props = makeProps({
      displayMasteryDescription: false
    })
    const wrapper = shallow(<OutcomeView {...props} />, {disableLifecycleMethods: true})
    const scoreMastery = wrapper.find(MasteryDescription)
    expect(scoreMastery.length).to.equal(0)
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeView {...makeProps()} />)
  })
})
