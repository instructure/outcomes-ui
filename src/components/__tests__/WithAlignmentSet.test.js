import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import WithAlignmentSet from '../WithAlignmentSet'

describe('WithAlignmentSet', () => {
  const Dummy = (props) => <div>{ props.text }</div> // eslint-disable-line react/prop-types
  const AlignedDummy = WithAlignmentSet(Dummy)

  function makeProps (props = {}) {
    return Object.assign({
      loadAlignments: sinon.spy(),
      alignmentSetId: 'xxxooo'
    }, props)
  }

  it('renders the inner component with props', () => {
    const wrapper = mount(<AlignedDummy {...makeProps({ text: 'foo' })} />)
    expect(wrapper.text()).to.match(/foo/)
  })

  it('loads alignments on mount', () => {
    const props = makeProps()
    mount(<AlignedDummy {...props} />)
    expect(props.loadAlignments.calledOnce).to.be.true
    expect(props.loadAlignments.calledWith('xxxooo')).to.be.true
  })

  it('loads launch contexts on mount', () => {
    const launchContexts = [
      {uuid: 'foo', name: 'foo'},
      {uuid: 'bar', name: 'bar'}
    ]
    const props = makeProps({
      launchContexts: launchContexts
    })
    mount(<AlignedDummy {...props} />)
    expect(props.loadAlignments.calledOnce).to.be.true
    expect(props.loadAlignments.getCall(0).args[1]).to.eql(launchContexts)
  })
})
