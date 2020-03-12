import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import AlignmentButton from '../index'
import checkA11y from '../../../test/checkA11y'

describe('AlignmentButton', () => {
  function makeProps (props = {}) {
    return Object.assign({
      alignedOutcomes: [
        { id: '1', label: 'A1', title: 'tA1' },
        { id: '2', label: 'B2', title: 'tB2' },
        { id: '3', label: 'C3', title: 'tC3' }
      ],
      tray: () => <div className="outcomeTray" />, // eslint-disable-line react/display-name
      scope: 'scopeForTest',
      openOutcomePicker: sinon.spy(),
      removeAlignment: sinon.spy(),
      onUpdate: sinon.spy(),
      screenreaderNotification: sinon.spy(),
    }, props)
  }

  it('renders a button with a11y components', () => {
    const wrapper = shallow(<AlignmentButton {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Button')).to.have.length(1)
    expect(wrapper.find('AccessibleContent')).to.have.length(1)
  })

  it('calls openOutcomePicker when the button is pressed', () => {
    const props = makeProps()
    const wrapper = shallow(<AlignmentButton {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Button').simulate('click')
    expect(props.openOutcomePicker.calledOnce).to.be.true
  })

  it('renders AlignmentItems for each aligned outcome', () => {
    const wrapper = mount(<AlignmentButton {...makeProps()} />)
    wrapper.find('ToggleGroup button').simulate('click') //expand ToggleGroup
    expect(wrapper.find('AlignmentItem')).to.have.length(3)
  })

  it('renders an AlignmentCount object', () => {
    const wrapper = mount(<AlignmentButton {...makeProps()} />)
    expect(wrapper.find('AlignmentCount')).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentButton {...makeProps()} />)
  })

  it('focuses on the previous alignment when second alignment deleted', (done) => {
    const wrapper = mount(<AlignmentButton {...makeProps()} />)
    wrapper.find('ToggleGroup button').simulate('click') //expand ToggleGroup
    setTimeout(() => {
      const first = wrapper.find('AlignmentItem').at(0)
      const next = wrapper.find('AlignmentItem').at(1)
      const focus = sinon.spy(first.instance(), 'focus')
      const remove = next.prop('removeAlignment')
      remove()
      setTimeout(() => {
        expect(focus.calledOnce).to.be.true
        expect(focus.calledWith()).to.be.true
        done()
      }, 1)
    }, 1)
  })

  it('focuses on the next alignment when first alignment deleted', (done) => {
    const wrapper = mount(<AlignmentButton {...makeProps()} />)
    wrapper.find('ToggleGroup button').simulate('click') //expand ToggleGroup
    setTimeout(() => {
      const first = wrapper.find('AlignmentItem').at(0)
      const next = wrapper.find('AlignmentItem').at(1)
      const remove = first.prop('removeAlignment')
      const focus = sinon.spy(next.instance(), 'focus')
      remove()
      setTimeout(() => {
        expect(focus.calledOnce).to.be.true
        expect(focus.calledWith()).to.be.true
        done()
      }, 1)
    }, 1)
  })
})
