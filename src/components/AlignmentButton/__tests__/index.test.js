import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import AlignmentButton from '../index'
import checkA11y from '../../../test/checkA11y'

describe('AlignmentButton', () => {
  function makeProps (props = {}) {
    return Object.assign({
      tray: () => <div className="outcomeTray" />, // eslint-disable-line react/display-name
      openOutcomePicker: sinon.spy(),
      scope: 'scopeForTest'
    }, props)
  }

  it('renders a button with a11y components', () => {
    const wrapper = mount(<AlignmentButton {...makeProps()} />)
    expect(wrapper.find('Button')).to.have.length(1)
    expect(wrapper.find('IconPlusLine')).to.have.length(1)
    expect(wrapper.find('AccessibleContent')).to.have.length(1)
  })

  it('calls openOutcomePicker when the button is pressed', () => {
    const props = makeProps()
    const wrapper = shallow(<AlignmentButton {...props} />)
    wrapper.find('Button').simulate('click')
    expect(props.openOutcomePicker.calledOnce).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentButton {...makeProps()} />)
  })
})
