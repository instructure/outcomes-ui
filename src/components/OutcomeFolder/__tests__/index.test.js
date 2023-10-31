import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeFolder from '../index'
import checkA11y from '../../../test/checkA11y'
import { Link } from '@instructure/ui-link'

describe('OutcomeFolder', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: { id: '101', label: 'XYZ', title: 'The student will make cupcakes' },
      clickable: true,
      getOutcomeSummary: sinon.spy(),
      setActiveCollection: sinon.spy(),
      toggleExpandedIds: sinon.spy()
    }, props)
  }

  it('will set the active collection and expand when the title is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeFolder {...props} />, {disableLifecycleMethods: true})
    const click = wrapper.find(Link).prop('onClick')
    click()

    expect(props.setActiveCollection.calledOnce).to.be.true
    expect(props.toggleExpandedIds.calledOnce).to.be.true
  })

  it('will set ensure the activeCollection is expanded before setting a new one', () => {
    const props = makeProps({activeCollectionId: '1'})
    const wrapper = mount(<OutcomeFolder {...props} />, {disableLifecycleMethods: true})
    const click = wrapper.find(Link).prop('onClick')
    click()

    expect(props.toggleExpandedIds.calledWith({id: '1', forceOpen: true})).to.be.true
  })

  it('will make titles unclickable if clickable set to false', () => {
    const props = makeProps({clickable: false})
    const wrapper = shallow(<OutcomeFolder {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Link')).to.have.length(0)
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeFolder {...makeProps()} />)
  })
})
