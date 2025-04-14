import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import OutcomeSelectionList from '../index'
import checkA11y from '../../../test/checkA11y'
import OutcomeCheckbox from '../../OutcomeCheckbox'

describe('OutcomeSelectionList', () => {
  function selectedIds (ids) {
    const isOutcomeSelected = sinon.stub()
    isOutcomeSelected.returns(false)
    ids.forEach((id) => {
      isOutcomeSelected.withArgs(id).returns(true)
    })
    return isOutcomeSelected
  }

  const outcomes = [
    { id: '1', label: 'ABC', title: 'Title1' },
    { id: '2', label: 'DEF', title: 'Title2' },
    { id: '3', label: 'GHI', title: 'Title3' },
  ]

  function makeProps (props = {}) {
    // const outcomes = outcomes
    return Object.assign({
      outcomes,
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: selectedIds([]),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy()
    }, props)
  }

  it('renders an empty element if no active ids', () => {
    const wrapper = shallow(
      <OutcomeSelectionList {...makeProps({activeChildrenIds: []})} />,
      {disableLifecycleMethods: true}
    )
    expect(wrapper.find('OutcomeCheckbox')).not.to.be.present
  })

  it('renders a checkbox for each outcome', () => {
    const wrapper = mount(<OutcomeSelectionList {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeCheckbox)).to.have.length(outcomes.length)
  })

  it('passes the right args to each checkbox', () => {
    const wrapper = mount(<OutcomeSelectionList {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeCheckbox).first().prop('outcome')).to.deep.equal({
      id: '1',
      label: 'ABC',
      title: 'Title1'
    })
  })

  it('renders a select all checkbox', () => {
    const wrapper = mount(<OutcomeSelectionList {...makeProps()} />, {disableLifecycleMethods: true})
    // Enzyme finds extra Checkbox components because of the instui decorator on the component
    expect(wrapper.find('Checkbox[value="selectAll"]')).to.have.length(3)
    expect(wrapper.find('Checkbox[value="selectAll"]').at(0).prop('id')).to.equal('outcome-select-all')
  })

  it('renders select all as unchecked when no outcomes selected', () => {
    const wrapper = mount(<OutcomeSelectionList {...makeProps()} />, {disableLifecycleMethods: true})
    // Enzyme finds extra Checkbox components because of the instui decorator on the component
    expect(wrapper.find('Checkbox[value="selectAll"]').at(0).prop('checked')).to.be.false
  })

  it('renders select all as unchecked when not all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />, {disableLifecycleMethods: true})
    // Enzyme finds extra Checkbox components because of the instui decorator on the component
    expect(wrapper.find('Checkbox[value="selectAll"]').at(0).prop('checked')).to.be.false
  })

  it('renders select all as checked when all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />, {disableLifecycleMethods: true})
    // Enzyme finds extra Checkbox components because of the instui decorator on the component
    expect(wrapper.find('Checkbox[value="selectAll"]').at(0).prop('checked')).to.be.true
  })

  it('renders select all checkbox as "Select all" when not all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />)
    expect(wrapper.find('Text').at(0).text()).to.equal('Select all')
  })

  it('renders select all checkbox as "Deselect all" when all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />)
    expect(wrapper.find('Text').at(0).text()).to.equal('Deselect all')
  })

  it('calls select function on all outcomes when select all is unchecked and clicked', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />, {disableLifecycleMethods: true})
    // Enzyme finds extra Checkbox components because of the instui decorator on the component
    const change = wrapper.find('Checkbox[value="selectAll"]').at(0).prop('onChange')
    change()
    expect(props.selectOutcomeIds.calledWith(['1', '2', '3'])).to.be.true
  })

  it('calls unselect function on all outcomes when select all is checked and clicked', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3'])
    })
    const wrapper = mount(<OutcomeSelectionList {...props} />, {disableLifecycleMethods: true})

    const change = wrapper.find('Checkbox[value="selectAll"]').at(0).prop('onChange')
    change()
    expect(props.deselectOutcomeIds.calledWith(['1', '2', '3'])).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeSelectionList {...makeProps()} />)
  })
})
