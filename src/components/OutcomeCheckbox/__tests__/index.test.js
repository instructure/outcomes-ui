import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeCheckbox from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeCheckbox', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: {
        id: '101',
        label: 'XYZ',
        title: 'The student will make cupcakes',
        description: 'Hello there'
      },
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy()
    }, props)
  }

  it('renders a checkbox', () => {
    const wrapper = shallow(<OutcomeCheckbox {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox')).to.have.length(1)
  })

  it('renders outcome title in link', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    const link = wrapper.find('Link')
    expect(link.text()).to.equal('The student will make cupcakes')
  })

  it('renders friendly description', () => {
    const props = makeProps({
      outcome: {
        id: '101',
        label: 'XYZ',
        title: 'The student will make cupcakes',
        description: 'Hello there',
        friendly_description: 'This is the Friendly Description'
      }
    })
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    expect(wrapper.text()).to.match(/This is the Friendly Description/)
  })

  it('does not render friendly description', () => {
    const wrapper = mount(<OutcomeCheckbox {...makeProps()} />)
    expect(wrapper.find('[data-automation="outcomeCheckbox__friendly_description_header"]').length).to.equal(0)
    expect(wrapper.find('[data-automation="outcomeCheckbox__friendly_description_expanded"]').length).to.equal(0)
  })

  it('renders an OutcomeDescription component', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    expect(wrapper.find('OutcomeDescription')).to.have.length(1)
  })

  it('will focus an outcome when the title is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    const click = wrapper.find('Link').prop('onClick')
    const preventDefault = sinon.stub()
    click({preventDefault})

    expect(props.setFocusedOutcome.calledOnce).to.be.true
    expect(preventDefault.calledOnce).to.be.true
  })

  it('selects the checkbox when isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(false)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(false)
  })

  it('does not select the checkbox when not isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(true)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(true)
  })

  it('calls selectOutcomeIds when unselected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(false)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.selectOutcomeIds.calledWith([101]))
  })

  it('calls deselectOutcomeIds when selected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(true)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.deselectOutcomeIds.calledWith([101]))
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeCheckbox {...makeProps()} />)
  })
})
