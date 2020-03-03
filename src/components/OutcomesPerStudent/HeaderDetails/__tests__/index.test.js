import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import HeaderDetails from '../index'
import styles from '../styles.css'
import checkA11y from '../../../../test/checkA11y'

describe('OutcomesPerStudent/HeaderDetails', () => {
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
      closeReportAlignment: sinon.spy(),
      showRollups: true
    }, props)
  }

  it('includes a progress bar', () => {
    const wrapper = shallow(<HeaderDetails {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('ProgressBar')).to.have.length(1)
  })

  it('hides the progress bar when rollups are hidden', () => {
    const wrapper = shallow(<HeaderDetails {...makeProps({showRollups: false})} />, {disableLifecycleMethods: true})
    expect(wrapper.find('ProgressBar')).to.have.length(0)
  })

  it('includes the rollup summary', () => {
    const wrapper = shallow(<HeaderDetails {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.masteryBarDetails}`).find('Text')).to.have.length(2)
  })

  it('hides the rollup summary when rollups are hidden', () => {
    const wrapper = shallow(<HeaderDetails {...makeProps({showRollups: false})} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.masteryBarDetails}`)).to.have.length(0)
  })

  it('does include tooltip', () => {
    const withUsesBank = {
      outcomeResult: {
        outcome: {
          id: '1',
          label: 'FOO'
        },
        count: 10,
        mastery_count: 5,
        childArtifactCount: 12,
        usesBank: true
      }
    }
    const wrapper = shallow(<HeaderDetails {...makeProps(withUsesBank)} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Tooltip')).to.have.length(1)
  })

  it('does not include tooltip', () => {
    const wrapper = shallow(<HeaderDetails {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Tooltip')).to.have.length(0)
  })

  it('includes the count of aligned items', () => {
    const wrapper = mount(<HeaderDetails {...makeProps()} />)
    expect(wrapper.text()).to.match(/12 Questions/)
  })

  it('does not include the count of aligned items if not specified', () => {
    const props = makeProps()
    props.outcomeResult.childArtifactCount = null // eslint-disable-line immutable/no-mutation
    const wrapper = mount(<HeaderDetails {...props} />)
    expect(wrapper.text()).not.to.match(/Questions/)
  })

  it('meets a11y standards', () => {
    return checkA11y(<HeaderDetails {...makeProps()} />)
  })
})
