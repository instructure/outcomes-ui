import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import createMockStore from '../../test/createMockStore'
import OutcomeAlignments from '../OutcomeAlignments'

describe('OutcomeAlignments', () => {
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
      <div id="app"><OutcomeAlignments {...makeProps()} /></div>
    )
    // Enzyme finds two AlignmentList components because of the instui decorator on the component
    expect(wrapper.find('AlignmentList')).to.have.length(2)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><OutcomeAlignments {...props} /></div>
    )
    // Enzyme finds two AlignmentList components because of the instui decorator on the component
    expect(wrapper.find('AlignmentList').at(0).prop('scope')).to.equal('foo:::1')
  })

  it('uses proper fallbacks if store is not passed in props', () => {
    const props = makeProps({store: void 0})
    const wrapper = mount(
      <div id="app"><OutcomeAlignments {...props} /></div>
    )
    // Enzyme finds two AlignmentList components because of the instui decorator on the component
    expect(wrapper.find('AlignmentList').at(0).prop('scope')).to.equal('foo:::1')
  })
})
