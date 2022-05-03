import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import OutcomeDescription from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeDescription', () => {
  function makeProps (props = {}) {
    return Object.assign({
      description: 'Hello there'
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

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeDescription {...makeProps()} />)
  })
})
