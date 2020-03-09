import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import createMockStore from '../../test/createMockStore'
import AlignmentButton from '../AlignmentButton'

describe('AlignmentButton', () => {
  function makeProps (props = {}) {
    const store = createMockStore()
    return Object.assign({
      store,
      artifactType: 'foo',
      emptySetHeading: '',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }, props)
  }

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><AlignmentButton {...makeProps()} /></div>
    )
    expect(wrapper.find('AlignmentButton')).to.have.length(1)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><AlignmentButton {...props} /></div>
    )
    expect(wrapper.find('AlignmentButton').prop('scope')).to.equal('foo:::1')
  })

  it('uses proper fallbacks if store is not passed in props', () => {
    const props = makeProps({store: void 0})
    const wrapper = mount(
      <div id="app"><AlignmentButton {...props} /></div>
    )
    expect(wrapper.find('AlignmentButton').prop('scope')).to.equal('foo:::1')
  })
})
