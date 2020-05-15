import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import AlignmentItem from '../index'
import checkA11y from '../../../../test/checkA11y'

describe('AlignmentItem', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: { id: '1', label: 'A1', title: 'tA1', description: 'dA1' },
      removeAlignment: sinon.spy(),
    }, props)
  }

  it('includes an OutcomeDescription', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeDescription')).to.have.length(1)
  })

  it('includes a trash icon and delete button', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('IconTrashLine')).to.have.length(1)
    expect(wrapper.find('IconButton')).to.have.length(1)
  })

  it('does not include a trash icon and delete button when readOnly is true', () => {
    const wrapper = shallow(<AlignmentItem {...makeProps({readOnly: true})} />,
      {disableLifecycleMethods: true})
    expect(wrapper.find('IconTrashLine')).to.have.length(0)
    expect(wrapper.find('IconButton')).to.have.length(0)
  })

  it('calls removeAlignment when the trash icon is clicked', () => {
    const props = makeProps()
    const wrapper = shallow(<AlignmentItem {...props} />, {disableLifecycleMethods: true})
    wrapper.find('IconButton').simulate('click')
    expect(props.removeAlignment.calledOnce).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentItem {...makeProps()} />)
  })
})
