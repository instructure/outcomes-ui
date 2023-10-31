import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import MasteryDescription from '../index'
import checkA11y from '../../../../test/checkA11y'
import { Spinner } from '@instructure/ui-spinner'
import styles from '../styles'
import { findElementsWithStyle } from '../../../../util/__tests__/findElementsWithStyle'

describe('MasteryDescription', () => {
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
      artifactTypeName: 'Quiz',
      displayMasteryPercentText: true,
      scoringMethod
    }, props)
  }

  it('renders spinner with no scoring method', () => {
    const props = makeProps({
      scoringMethod: null
    })
    const wrapper = mount(<MasteryDescription {...props} />, {attachTo: document.body})
    expect(wrapper.find(Spinner)).to.have.length(1)
  })

  it('does not render mastery percent text if displayMasteryPercentText is false', () => {
    const props = makeProps({
      displayMasteryPercentText: false
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const scoreMastery = wrapper.find(`.${styles.scoreMasteryText}`)
    expect(scoreMastery.length).to.equal(0)
  })

  it('does not render mastery percent text if no artifactTypeName provided', () => {
    const props = makeProps({
      artifactTypeName: null
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const scoreMastery = wrapper.find(`.${styles.scoreMasteryText}`)
    expect(scoreMastery.length).to.equal(0)
  })

  it('renders mastery percent text', () => {
    const wrapper = mount(<MasteryDescription {...makeProps()} />)
    const scoreMastery = findElementsWithStyle(wrapper, styles().scoreMasteryText)
    expect(scoreMastery.length).to.equal(1)
  })

  it('renders mastery description for decaying_average', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'decaying_average'}
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const txt = findElementsWithStyle(wrapper, styles().scoreMastery)
    expect(txt.first().text()).to.match(/Decaying Average/)
  })

  it('renders mastery description for n_mastery', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'n_mastery'}
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const txt = findElementsWithStyle(wrapper, styles().scoreMastery).find('Text')
    expect(txt.first().text()).to.match(/n Number of Times/)
  })

  it('renders mastery description for highest', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'highest'}
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const txt = findElementsWithStyle(wrapper, styles().scoreMastery).find('Text')
    expect(txt.first().text()).to.match(/Highest Score/)
  })

  it('renders mastery description for latest', () => {
    const props = makeProps({
      scoringMethod: {...scoringMethod, mastery_percent: 0.8, algorithm: 'latest'}
    })
    const wrapper = mount(<MasteryDescription {...props} />)
    const txt = findElementsWithStyle(wrapper, styles().scoreMastery).find('Text')
    expect(txt.first().text()).to.match(/Most Recent Score/)
  })

  it('meets a11y standards', () => {
    return checkA11y(<MasteryDescription {...makeProps()} />)
  })
})
