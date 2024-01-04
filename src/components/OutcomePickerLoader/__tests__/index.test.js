import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import OutcomePickerLoader from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomePickerLoader', () => {
  function DummyComponent () {
    return <div className="dummy" />
  }

  function makeProps (props = {}) {
    return Object.assign({
      outcomePicker: DummyComponent,
      loadOutcomePicker: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      outcomePickerState: 'closed',
      scope: 'scopeForTest'
    }, props)
  }

  it('calls loadOutcomePicker on mount', () => {
    const props = makeProps()
    shallow(<OutcomePickerLoader {...props} />)
    expect(props.loadOutcomePicker.calledOnce).to.be.true
    expect(props.loadOutcomePicker.calledWith()).to.be.true
  })

  it('calls loadOutcomePicker with sharedContexts on mount', () => {
    const sharedContexts = [{uuid: 'foo', name: 'bar'}, {uuid: 'fuz', name: 'baz'}]
    const props = makeProps({sharedContexts: sharedContexts})
    shallow(<OutcomePickerLoader {...props} />)
    expect(props.loadOutcomePicker.calledOnce).to.be.true
    expect(props.loadOutcomePicker.calledWith(sharedContexts)).to.be.true
  })

  it('displays nothing when closed', () => {
    const wrapper = shallow(<OutcomePickerLoader {...makeProps()} />)
    expect(wrapper.equals(<div />)).to.be.true
  })

  it('displays a spinner while loading', () => {
    const props = makeProps({ outcomePickerState: 'loading' })
    const wrapper = shallow(<OutcomePickerLoader {...props} />)
    expect(wrapper.find('Spinner')).to.have.length(1)
    expect(wrapper.find('Spinner').prop('renderTitle')).to.equal('Loading')
  })

  it('displays the outcome picker while choosing', () => {
    const props = makeProps({ outcomePickerState: 'choosing' })
    const wrapper = shallow(<OutcomePickerLoader {...props} />)
    expect(wrapper.find(DummyComponent)).to.have.length(1)
  })

  it('displays a spinner while saving', () => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerLoader {...props} />)
    expect(wrapper.find('Spinner')).to.have.length(1)
    expect(wrapper.find('Spinner').prop('renderTitle')).to.equal('Saving')
  })

  it('displays a success message while complete', () => {
    const props = makeProps({ outcomePickerState: 'complete' })
    const wrapper = shallow(<OutcomePickerLoader {...props} />)
    expect(wrapper.text()).to.equal('Complete')
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomePickerLoader {...makeProps()} />)
  })
})
