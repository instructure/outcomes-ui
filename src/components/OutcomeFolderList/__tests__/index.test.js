import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeFolderList from '../index'
import checkA11y from '../../../test/checkA11y'
import OutcomeFolder from '../../OutcomeFolder'

describe('OutcomeFolderList', () => {
  const outcomes = [
    { id: '1', label: 'ABC', title: 'Title1' },
    { id: '2', label: 'DEF', title: 'Title2' },
    { id: '3', label: 'GHI', title: 'Title3' }
  ]
  function makeProps (props = {}) {
    return Object.assign({
      outcomes,
      getOutcomeSummary: sinon.spy(),
      setActiveCollection: sinon.spy(),
      toggleExpandedIds: sinon.spy()
    }, props)
  }

  it('renders an empty div if there are no ids', () => {
    const wrapper = shallow(<OutcomeFolderList {...makeProps({ids: []})} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeFolder')).not.to.be.present
  })

  it('renders a folder for each outcome', () => {
    const wrapper = mount(<OutcomeFolderList {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeFolder)).to.have.length(3)
  })

  it('passes the right args to each checkbox', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeFolderList {...props} />, {disableLifecycleMethods: true})
    const folder = wrapper.find(OutcomeFolder).first()
    expect(folder.prop('outcome')).to.deep.equal({
      id: '1',
      label: 'ABC',
      title: 'Title1'
    })
    expect(folder.prop('setActiveCollection')).to.equal(props.setActiveCollection)
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeFolderList {...makeProps()} />)
  })
})
