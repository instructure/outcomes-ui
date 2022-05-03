import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import AlignmentItem from '../index'
import checkA11y from '../../../test/checkA11y'

describe('AlignmentItem', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: { id: '1', label: 'A1', title: 'tA1', description: 'dA1' },
      removeAlignment: sinon.spy(),
      canManageOutcomes: true,
      isTray: false,
      shouldFocus: false,
      isOutcomeSelected: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy()
    }, props)
  }

  it('renders title', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />)
    expect(wrapper.find('Text')).to.have.length(1)
  })

  it('includes an OutcomeDescription', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeDescription')).to.have.length(1)
  })

  it('includes a trash icon and delete button if in the alignment list', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('IconTrashLine')).to.have.length(1)
    expect(wrapper.find('IconButton')).to.have.length(2)
  })

  it('does not include a trash icon and delete button if in the outcome tray', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps({isTray: true})} />, {disableLifecycleMethods: true})
    expect(wrapper.find('IconTrashLine')).to.have.length(0)
    expect(wrapper.find('IconButton')).to.have.length(1)
  })

  it('does not include a trash icon and delete button when canManageOutcomes is false', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps({canManageOutcomes: false})} />,
      {disableLifecycleMethods: true})
    expect(wrapper.find('IconTrashLine')).to.have.length(0)
    expect(wrapper.find('IconButton')).to.have.length(1)
  })

  it('focuses on the trash can icon if shouldFocus is true', () => {
    const wrapper = mount(<AlignmentItem {...makeProps()} />)
    wrapper.setProps({...makeProps({shouldFocus: true})})
    expect(wrapper.getDOMNode().contains(document.activeElement))
  })

  it('does not focus on the trash can icon if shouldFocus is false', () => {
    const wrapper = mount(<AlignmentItem {...makeProps()} />)
    wrapper.setProps({...makeProps()})
    expect(wrapper.getDOMNode().contains(document.activeElement)).to.be.false
  })

  it('calls removeAlignment when the trash icon is clicked', () => {
    const props = makeProps()
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    wrapper.find('IconButton').at(1).simulate('click')
    expect(props.removeAlignment.calledOnce).to.be.true
  })

  it('includes a checkbox if in the outcome tray', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps({isTray: true})} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox')).to.have.length(1)
  })

  it('does not include a checkbox if in the alignment list', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox')).to.have.length(0)
  })

  it('handles click on checkbox', () => {
    const props = makeProps({isTray: true})
    const wrapper = shallow(<AlignmentItem {...props} />)
    wrapper.find('Checkbox').simulate('click')
    expect(props.isOutcomeSelected.calledOnce).to.be.true
  })

  it('selects the checkbox when isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(1).returns(false)
    const props = makeProps({ isOutcomeSelected, isTray: true })
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(false)
  })

  it('does not select the checkbox when not isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(1).returns(true)
    const props = makeProps({ isOutcomeSelected, isTray: true })
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(true)
  })

  it('calls selectOutcomeIds when unselected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(1).returns(false)
    const props = makeProps({ isOutcomeSelected, isTray: true })
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.selectOutcomeIds.calledWith([1]))
  })

  it('calls deselectOutcomeIds when selected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(1).returns(true)
    const props = makeProps({ isOutcomeSelected, isTray: true })
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.deselectOutcomeIds.calledWith([1]))
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentItem {...makeProps()} />)
  })
})