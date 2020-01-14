import { expect } from 'chai'
import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import createMockStore from '../../test/createMockStore'
import OutcomeSDKComponent from '../OutcomeSDKComponent'
import { getConfig } from '../../store/config/selectors'

describe('OutcomeSDKComponent', () => {
  const Inner = (props) => <div />
  const Wrapped = OutcomeSDKComponent(Inner, { foo: PropTypes.string })

  function makeProps (props = {}) {
    const store = createMockStore()
    return Object.assign({
      store,
      artifactType: 'foo',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }, props)
  }

  it('requires sdk prop types', () => {
    expect(Wrapped.propTypes.artifactType).to.equal(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.artifactId).to.equal(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.host).to.equal(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.jwt).to.equal(PropTypes.string.isRequired)
  })

  it('adds required prop types', () => {
    expect(Wrapped.propTypes.foo).to.equal(PropTypes.string)
  })

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><Wrapped {...makeProps()} /></div>
    )
    expect(wrapper.find(Inner)).to.have.length(1)
  })

  it('sets the scope', () => {
    const props = makeProps()
    const wrapper = mount(
      <div id="app"><Wrapped {...props} /></div>
    )
    expect(wrapper.find(Inner).prop('scope')).to.equal('foo:::1')
  })

  it('creates a user scope', () => {
    const props = makeProps({
      userUuid: 'myUserId'
    })
    const wrapper = mount(
      <div id="app"><Wrapped {...props} /></div>
    )
    expect(wrapper.find(Inner).prop('scope')).to.equal('user::foo:1:myUserId')
  })

  it('uses the supplied store', () => {
    const props = makeProps()
    const wrapper = mount(<Wrapped {...props} />)
    expect(wrapper.instance().store()).to.equal(props.store)
  })

  it('creates a default store', () => {
    const props = makeProps({ store: null })
    const wrapper = mount(<Wrapped {...props} />)
    expect(wrapper.instance().store()).not.to.be.null
  })

  it('converts null context uuid to empty string property', () => {
    const props = makeProps({ contextUuid: null })
    const wrapper = mount(<Wrapped {...props} />)
    expect(wrapper.find(Inner).prop('contextUuid')).to.equal('')
  })

  it('converts null context uuid to empty store key', () => {
    const props = makeProps({ store: null, contextUuid: null })
    const wrapper = mount(<Wrapped {...props} />)
    expect(getConfig(wrapper.instance().store().getState(), 'foo:::1').contextUuid).to.equal('')
  })
})
