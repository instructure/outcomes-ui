import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import checkA11y from '../../../../test/checkA11y'
import OutcomeList from '../index'

describe('OutcomeList', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcomes: [
        {id: '1', label: 'foo', title: 'bar' }
      ],
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy(),
      isLoading: false,
    }, props)
  }

  it('renders an AlignmentItem', () => {
    const wrapper = shallow(<OutcomeList {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('AlignmentItem')).to.have.length(1)
  })

  it('renders loading spinner when state is loading', () => {
    const props = makeProps({ isLoading: true })
    const wrapper = shallow(<OutcomeList {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Spinner')).to.have.length(1)
  })

  it('renders pagination', () => {
    const wrapper = shallow(<OutcomeList {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Pagination')).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeList {...makeProps()} />)
  })
})
