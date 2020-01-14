import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import { Map } from 'immutable'
import sinon from 'sinon'
import createMockStore from '../../test/createMockStore'
import StudentMastery from '../StudentMastery'

describe('StudentMastery', () => {
  function makeProps () {
    const service = { getIndividualResults: sinon.stub().returns(Promise.resolve()) }
    const store = createMockStore(Map(), service)
    return {
      store,
      artifactType: 'foo',
      artifactId: '1',
      userUuid: 'userId',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }
  }

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><StudentMastery {...makeProps()} /></div>
    )
    expect(wrapper.find('StudentMastery')).to.have.length(1)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><StudentMastery {...props} /></div>
    )
    expect(wrapper.find('StudentMastery').prop('scope')).to.equal('user::foo:1:userId')
  })
})
