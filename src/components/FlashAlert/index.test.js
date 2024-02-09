import React from 'react'
import ReactDOM from 'react-dom'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'
import FlashAlert, {showFlashAlert, showFlashError, showFlashSuccess, defaultTimeout} from '../FlashAlert'
import {Transition} from '@instructure/ui-motion'
import {Alert} from '@instructure/ui-alerts'

describe('FlashAlert', () => {
  let renderSpy
  let clock

  beforeEach(() => {
    renderSpy = sinon.spy(ReactDOM, 'render')
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    renderSpy.restore()
    clock.restore()
  })

  const makeProps = (props) => ({
    message: 'This is a test error message 123',
    timeout: defaultTimeout,
    error: new Error('This is a test error 321'),
    variant: 'error',
    onClose: sinon.spy(),
    screenReaderOnly: false,
    ...props
  })

  it('renders', () => {
    const screen = mount(<FlashAlert {...makeProps({})} />)
    expect(screen.text()).to.match(/This is a test error message 123/)
    expect(screen.text()).to.match(/This is a test error 321/)
  })

  it('renders, but does not show loading chunk text', () => {
    const screen = mount(<FlashAlert {...makeProps({error: new Error('loading chunk 123')})} />)
    expect(screen.text()).to.match(/This is a test error message 123/)
    expect(screen.text()).not.to.match(/loading chunk 123/)
  })

  it('renders Transition component', () => {
    const screen = mount(<FlashAlert {...makeProps({})} />)
    const transition = screen.find(Transition).first()
    expect(transition).to.exist
    expect(transition.prop('transitionOnMount')).to.be.true
    expect(transition.prop('in')).to.be.true
    expect(transition.prop('type')).to.eq('fade')
    clock.tick(defaultTimeout)
    screen.update()
    const transition2 = screen.find(Transition).at(1)
    expect(transition2.prop('in')).to.be.false
  })

  it('renders Alert component', () => {
    const props = makeProps({})
    const screen = mount(<FlashAlert {...props} />)
    const alert = screen.find(Alert)
    expect(alert).to.exist
    expect(alert.prop('variant')).to.eq(props.variant)
    expect(alert.prop('renderCloseButtonLabel')).to.eq('Close')
    expect(alert.prop('onDismiss')).to.not.be.undefined
    expect(alert.prop('margin')).to.eq('small auto')
    expect(alert.prop('timeout')).to.eq(props.timeout)
    expect(alert.prop('liveRegion')).to.not.be.undefined
    expect(alert.prop('transition')).to.eq('fade')
    expect(alert.prop('screenReaderOnly')).to.eq(props.screenReaderOnly)
  })

  describe('showFlashAlert', () => {
    it('calls render', () => {
      const props = makeProps({})
      showFlashAlert({...props})
      expect(renderSpy).to.have.been.called
    })
  })

  describe('showFlashError', () => {
    it('calls render', () => {
      const showAlert = showFlashError()
      showAlert()
      expect(renderSpy).to.have.been.called
    })
  })

  describe('showFlashSuccess', () => {
    it('calls render', () => {
      const showAlert = showFlashSuccess('showFlashSuccess')
      showAlert()
      expect(renderSpy).to.have.been.called
    })
  })
})
