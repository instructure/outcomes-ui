import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import createMockStore from '../../test/createMockStore'
import AlignmentCount from '../../components/AlignmentCount'
import OutcomeCount from '../OutcomeCount'

describe('OutcomeCount', () => {
  function makeProps (props = {}) {
    const store = createMockStore()
    return Object.assign({
      store,
      alignmentSetId: '',
      artifactType: 'foo',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }, props)
  }

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><OutcomeCount {...makeProps()} /></div>
    )
    expect(wrapper.find(AlignmentCount)).to.have.length(1)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><OutcomeCount {...props} /></div>
    )
    expect(wrapper.find(AlignmentCount).prop('scope')).to.equal('foo:::1')
  })

  it('uses proper fallbacks if store not passed in props', () => {
    const props = {artifactType: 'foo', artifactId: '1', host: '', jwt: '', alignmentSetId: ''}
    const wrapper = mount(
      <div id="app"><OutcomeCount {...props} /></div>
    )
    expect(wrapper.find(AlignmentCount).prop('scope')).to.equal('foo:::1')
  })
})
