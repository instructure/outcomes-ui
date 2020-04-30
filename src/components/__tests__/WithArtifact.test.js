import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import WithArtifact from '../WithArtifact'

describe('WithArtifact', () => {
  const Dummy = (props) => <div>{ props.text }</div> // eslint-disable-line react/prop-types
  const AlignedDummy = WithArtifact(Dummy)

  const artifact = { artifactType: 'quizzes.quiz', artifactId: '1' }
  function makeProps (props = {}) {
    return {
      loadArtifact: sinon.spy(),
      ...artifact,
      ...props
    }
  }

  it('renders the inner component with props', () => {
    const wrapper = mount(<AlignedDummy {...makeProps({ text: 'foo' })} />)
    expect(wrapper.text()).to.match(/foo/)
  })

  it('loads alignments on mount', () => {
    const props = makeProps()
    mount(<AlignedDummy {...props} />)
    expect(props.loadArtifact.calledOnce).to.be.true
    expect(props.loadArtifact.calledWith(artifact)).to.be.true
  })
})
