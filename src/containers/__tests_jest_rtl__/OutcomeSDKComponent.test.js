
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PropTypes from 'prop-types'
import '@testing-library/jest-dom'
import createMockStore from '../../test/createMockStore_jest_rtl'
import OutcomeSDKComponent from '../OutcomeSDKComponent'
import { connect } from 'react-redux'

describe('OutcomeSDKComponent', () => {

  function createComponent() {
    const Inner = (props) => {
      return <div>
        <div data-testid="store-state">{props.storeState}</div>
        <div data-testid="scope">{props.scope}</div>
        <div data-testid="contextUuid">{props.contextUuid == '' ? 'emptystring' : props.contextUuid}</div>
        <div data-testid="artifactType">{props.artifactType}</div>
        <div data-testid="artifactId">{props.artifactId}</div>
        <div data-testid="host">{props.host}</div>
        <div data-testid="jwt">{props.jwt}</div>
        <div data-testid="userUuid">{props.userUuid}</div>
      </div>
    }
    const connected = connect(state => ({
      storeState: Array.from(state.keys()).join('/')
    }))(Inner)
    const Wrapped = OutcomeSDKComponent(connected, { foo: PropTypes.string })

    return {
      Wrapped,
      Inner
    }
  }

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
    const { Wrapped } = createComponent()
    expect(Wrapped.propTypes.artifactType).toEqual(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.artifactId).toEqual(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.host).toEqual(PropTypes.string.isRequired)
    expect(Wrapped.propTypes.jwt).toEqual(PropTypes.string.isRequired)
  })

  it('adds required prop types', () => {
    const { Wrapped } = createComponent()
    expect(Wrapped.propTypes.foo).toEqual(PropTypes.string)
  })

  it('renders', () => {
    const { Wrapped } = createComponent()
    render(
      <div id="app"><Wrapped {...makeProps()} /></div>
    )
    expect(screen.getByTestId('scope')).toBeInTheDocument()
  })

  it('sets the scope', () => {
    const { Wrapped } = createComponent()
    const props = makeProps()
    render(
      <div id="app"><Wrapped {...props} /></div>
    )
    expect(screen.getByTestId('scope').textContent).toEqual('foo:::1')
  })

  it('creates a user scope', () => {
    const { Wrapped } = createComponent()
    const props = makeProps({
      userUuid: 'myUserId'
    })
    render(<div id="app"><Wrapped {...props} /></div>)
    expect(screen.getByTestId('scope').textContent).toEqual('user::foo:1:myUserId')
  })

  it('uses the supplied store', () => {
    const { Wrapped } = createComponent()
    const props = makeProps()
    render(<Wrapped {...props} />)
    expect(screen.getByTestId('store-state').textContent).toEqual('')
  })

  it('creates a default store', () => {
    const { Wrapped } = createComponent()
    const props = makeProps({ store: null })
    render(<Wrapped {...props} />)
    expect(screen.getByTestId('store-state').textContent).toEqual('context/features/activePicker/foo:::1')
  })

  it('converts null context uuid to empty string property', () => {
    const { Wrapped } = createComponent()
    const props = makeProps({ contextUuid: null })
    render(<Wrapped {...props} />)
    expect(screen.getByTestId('contextUuid').textContent).toEqual('emptystring')
  })

  it('converts null context uuid to empty store key', () => {
    const { Wrapped } = createComponent()
    const props = makeProps({ store: null, contextUuid: null })
    render(<Wrapped {...props} />)
    expect(screen.getByTestId('contextUuid').textContent).toEqual('emptystring')
  })
})
