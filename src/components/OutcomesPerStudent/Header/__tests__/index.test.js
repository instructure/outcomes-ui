import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import Header from '../index'
import styles from '../styles.css'
import checkA11y from '../../../../test/checkA11y'

describe('OutcomesPerStudent/Header', () => {
  function makeProps (props) {
    return Object.assign({
      outcomeResult: {
        outcome: {
          id: '1',
          label: 'FOO'
        },
        count: 10,
        mastery_count: 5,
        childArtifactCount: 12
      },
      viewReportAlignment: sinon.spy(),
      getReportOutcome: sinon.stub().returns({ id: '1', label: 'FOO', title: 'bar' }),
      isOpen: false,
      closeReportAlignment: sinon.spy()
    }, props)
  }

  it('includes a details object', () => {
    const wrapper = shallow(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('HeaderDetails')).to.have.length(1)
  })

  it('renders outcome link with title', () => {
    const props = makeProps()
    const wrapper = mount(<Header {...props} />)
    expect(wrapper.text()).to.match(/bar/)
  })

  it('calls viewReportAlignment when the link is clicked', () => {
    const props = makeProps()
    const wrapper = shallow(<Header {...props} />, {disableLifecycleMethods: true})
    const link = wrapper.find(`.${styles.header}`).find('Link')
    link.simulate('click')

    expect(props.viewReportAlignment.calledOnce).to.be.true
  })

  it('conditionally renders tooltip based on state.showTooltip', () => {
    const wrapper = shallow(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Tooltip')).to.have.length(0)
    wrapper.setState({showTooltip: true})
    expect(wrapper.find('Tooltip')).to.have.length(1)
  })

  it('includes a TruncateText element that can update state', () => {
    const wrapper = mount(<Header {...makeProps()} />)
    expect(wrapper.find('TruncateText')).to.have.length(1)
    wrapper.find('TruncateText').props().onUpdate(true)
    expect(wrapper.state().showTooltip).to.equal(true)
  })

  it('includes a AccessibleContent element', () => {
    const wrapper = shallow(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('AccessibleContent')).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<Header {...makeProps()} />)
  })
})
