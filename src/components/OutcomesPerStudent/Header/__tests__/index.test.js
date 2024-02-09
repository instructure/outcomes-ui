import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import Header from '../index'
import styles from '../styles'
import checkA11y from '../../../../test/checkA11y'
import HeaderDetails from '../../HeaderDetails'
import { Tooltip } from '@instructure/ui-tooltip'
import { TruncateText } from '@instructure/ui-truncate-text'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { findElementsWithStyle } from '../../../../util/__tests__/findElementsWithStyle'
import { Link } from '@instructure/ui-link'

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
      scope: 'artifactType::artifactId',
      viewReportAlignment: sinon.spy(),
      getReportOutcome: sinon.stub().returns({ id: '1', label: 'FOO', title: 'bar' }),
      isOpen: false,
      closeReportAlignment: sinon.spy()
    }, props)
  }

  it('includes a details object', () => {
    const wrapper = mount(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(HeaderDetails)).to.have.length(1)
  })

  it('renders outcome link with title', () => {
    const props = makeProps()
    const wrapper = mount(<Header {...props} />)
    expect(wrapper.text()).to.match(/bar/)
  })

  it('calls viewReportAlignment when the link is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<Header {...props} />, {disableLifecycleMethods: true})
    const link = findElementsWithStyle(wrapper, styles().header).find(Link)
    link.simulate('click')

    expect(props.viewReportAlignment.calledOnce).to.be.true
  })

  it('conditionally renders tooltip when TruncateText is updated', () => {
    const wrapper = mount(<Header {...makeProps()} />)
    expect(wrapper.find(Tooltip)).to.have.length(0)
    wrapper.find(TruncateText).props().onUpdate(true)
    wrapper.update()
    expect(wrapper.find(Tooltip)).to.have.length(1)
  })

  it('includes a AccessibleContent element', () => {
    const wrapper = mount(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(AccessibleContent)).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<Header {...makeProps()} />)
  })
})
