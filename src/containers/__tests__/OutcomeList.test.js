import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import createMockStore from '../../test/createMockStore'
import OutcomeList from '../OutcomeList'

describe('OutcomeList', () => {
  function makeProps () {
    const store = createMockStore()
    return {
      store,
      artifactType: 'foo',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }
  }

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><OutcomeList {...makeProps()} /></div>
    )
    // Enzyme finds two OutcomeLabels components because of the instui decorator on the component
    expect(wrapper.find('OutcomeLabels')).to.have.length(2)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><OutcomeList {...props} /></div>
    )
    // Enzyme finds two Link components because of the instui decorator on the component
    expect(wrapper.find('OutcomeLabels').at(0).prop('scope')).to.equal('foo:::1')
  })
})
