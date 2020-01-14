import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import StudentMastery from '../index'
import checkA11y from '../../../test/checkA11y'

describe('StudentMastery', () => {
  const masteryResult = {
    outcome_id: 1,
    percent_score: 1.0,
    outcome: {
      id: '1',
      title: 'Title-Mastery',
      description: 'Description-Mastery',
      scoring_method: {
        mastery_percent: 1.0
      }
    },
    outcome_rollup: {
      average_score: 0.9
    }
  }

  const noMasteryResult = {
    outcome_id: 2,
    percent_score: 0.0,
    outcome: {
      id: '2',
      title: 'Title-NoMastery',
      description: 'Description-NoMastery',
      scoring_method: {
        mastery_percent: 1.0
      }
    },
    outcome_rollup: {
      average_score: 0.8
    }
  }

  function makeProps (props = {}) {
    return Object.assign({
      artifactType: 'quiz',
      artifactId: '1',
      userUuid: 'userId',
      mastery: true,
      loadIndividualResults: sinon.spy(),
      results: [masteryResult, noMasteryResult],
      state: 'loaded'
    }, props)
  }

  it('includes the mastery text', () => {
    const wrapper = mount(<StudentMastery {...makeProps()} />)
    const text = wrapper.text()
    expect(text).to.match(/Learning Outcomes You've Mastered/)
  })

  it('includes the non-mastery text', () => {
    const props = makeProps({
      mastery: false
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Opportunities for Learning and Growth/)
  })

  it('overrides the mastery text', () => {
    const props = makeProps({
      masteryText: "You're the best"
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/You're the best/)
  })

  it('renders outcome title', () => {
    const props = makeProps()
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Title-Mastery/)
  })

  it('renders outcome label', () => {
    const props = makeProps({
      displayOutcomeLabel: true
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Description-Mastery/)
  })

  it('renders and sanitizes outcome label', () => {
    const result = {
      ...masteryResult,
      outcome: {
        ...masteryResult.outcome,
        description: 'I like to <blink> yo'
      }
    }
    const props = makeProps({ results: [result] })
    const wrapper = mount(<StudentMastery {...props} />)
    expect(wrapper.html()).to.include('</blink>')
  })

  it('renders student score', () => {
    const props = makeProps()
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.find('td').at(1).text()
    expect(text).to.eq('100%')
  })

  it('renders institution score', () => {
    const props = makeProps()
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.find('td').at(2).text()
    expect(text).to.eq('90%')
  })

  it('renders difference between scores', () => {
    const props = makeProps()
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.find('td').at(3).text()
    expect(text).to.eq('11%')
  })

  it('renders zero difference when average is zero', () => {
    const props = makeProps({
      results: [Object.assign({}, masteryResult, { outcome_rollup: { average_score: 0.0 } })]
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.find('td').at(3).text()
    expect(text).to.eq('0%')
  })

  it('does not render mastery result', () => {
    const props = makeProps({
      mastery: false
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).not.to.match(/Title-Mastery/)
  })

  it('renders non-mastery result', () => {
    const props = makeProps({
      mastery: false
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Title-NoMastery/)
  })

  it('does not render non-mastery result', () => {
    const props = makeProps({
      mastery: true
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).not.to.match(/Title-NoMastery/)
  })

  it('renders "No Opportunities" when all mastered and mastery false', () => {
    const props = makeProps({
      mastery: false,
      results: [masteryResult]
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Opportunities for Learning and Growth/)
    expect(text).to.match(/no opportunities/)
  })

  it('renders "None mastered" when none mastered and mastery true', () => {
    const props = makeProps({
      results: [noMasteryResult]
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/Learning Outcomes You've Mastered/)
    expect(text).to.match(/You have not mastered any/)
  })

  it('renders "No Opportunities" when no results and mastery false', () => {
    const props = makeProps({
      mastery: false,
      results: []
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/no opportunities/)
  })

  it('renders "No Opportunities" when no results and mastery true', () => {
    const props = makeProps({
      results: []
    })
    const wrapper = mount(<StudentMastery {...props} />)
    const text = wrapper.text()
    expect(text).to.match(/no opportunities/)
  })

  it('renders spinner', () => {
    const props = makeProps({
      state: 'loading'
    })
    const wrapper = mount(<StudentMastery {...props} />)
    expect(wrapper.text()).to.include('Learning Outcomes You\'ve Mastered')
    expect(wrapper.find('Spinner')).to.have.length(1)
    expect(wrapper.find('Spinner').prop('renderTitle')).to.equal('Loading')
  })

  it('meets a11y standards', () => {
    return checkA11y(<StudentMastery {...makeProps()} />)
  })
})
