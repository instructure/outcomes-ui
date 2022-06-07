import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import OutcomeDescription from '../index'
import checkA11y from '../../../test/checkA11y'
import { ratings } from '../../../test/mockOutcomesData'

describe('OutcomeDescription', () => {
  function makeProps (props = {}) {
    return Object.assign({
      description: 'Hello there',
      truncated: true,
      ratings: ratings,
      calculationMethod: 'latest',
      calculationInt: {}
    }, props)
  }

  it('renders outcome description', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.text()).to.match(/Hello there/)
  })

  it('sanitizes an outcome description', () => {
    const props = makeProps({description: 'Hello <img src="bigimage" />' })
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.html()).not.to.include('bigimage')
    expect(wrapper.html()).not.to.include('img')
  })

  it('renders a TruncateText element if the outcome description is long', () => {
    const props = makeProps({description: 'a'.repeat(500) })
    const wrapper = shallow(<OutcomeDescription {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('TruncateText')).to.have.length(1)
  })

  it('renders outcome label and description', () => {
    const props = makeProps({label: 'Outcome label'})
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.text()).to.match(/Outcome labelHello there/)
  })

  it('renders only the description if user cannot manage outcomes', () => {
    const props = makeProps({label: 'Outcome label'})
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.text()).to.match(/Hello there/)
  })

  it('renders a friendly description if there is one and if expanded', () => {
    const props = makeProps({friendlyDescription: 'Outcome Friendly Description', truncated: false})
    const wrapper = mount(<OutcomeDescription {...props} />)
    const text = wrapper.find('Text').at(1)
    expect(text.text()).to.match(/Outcome Friendly Description/)
  })

  it('does not render a friendly description if not expanded', () => {
    const props = makeProps({friendlyDescription: 'Outcome Friendly Description'})
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.find('Text')).to.have.length(1)
    const text = wrapper.find('Text').at(0)
    expect(text.text()).not.to.match(/Outcome Friendly Description/)
  })

  it('renders the ratings if expanded', () => {
    const props = makeProps({truncated: false})
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.find('Ratings')).to.have.length(1)
  })

  it('does not render the ratings if not expanded', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeDescription {...props} />)
    expect(wrapper.find('Ratings')).to.have.length(0)
  })

  describe('renders proficiency calculation text correctly', () => {
    it('for latest method', () => {
      const props = makeProps({truncated: false})
      const wrapper = mount(<OutcomeDescription {...props} />)
      const text = wrapper.find('Text').last()
      expect(text.text()).to.match(/Most Recent Score/)
    })

    it('for highest method', () => {
      const props = makeProps({calculationMethod: 'highest', truncated: false})
      const wrapper = mount(<OutcomeDescription {...props} />)
      const text = wrapper.find('Text').last()
      expect(text.text()).to.match(/Highest Score/)
    })

    it('for n mastery method', () => {
      const n_mastery = { n_mastery_count: 3}
      const props = makeProps({calculationMethod: 'n_mastery', calculationInt: n_mastery, truncated: false})
      const wrapper = mount(<OutcomeDescription {...props} />)
      const text = wrapper.find('Text').last()
      expect(text.text()).to.match(/Achieve Mastery 3 times/)
    })

    it('for average method', () => {
      const props = makeProps({calculationMethod: 'average', truncated: false})
      const wrapper = mount(<OutcomeDescription {...props} />)
      const text = wrapper.find('Text').last()
      expect(text.text()).to.match(/Average/)
    })

    it('for decaying average method', () => {
      const n_mastery = { decaying_average_percent: 65}
      const props = makeProps({calculationMethod: 'decaying_average', calculationInt: n_mastery, truncated: false})
      const wrapper = mount(<OutcomeDescription {...props} />)
      const text = wrapper.find('Text').last()
      expect(text.text()).to.eq('Decaying Average - 65%/35%')
    })
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeDescription {...makeProps()} />)
  })
})
