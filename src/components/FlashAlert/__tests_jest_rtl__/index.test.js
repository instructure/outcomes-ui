import {expect, jest} from '@jest/globals'
import React from 'react'
import ReactDOM from 'react-dom'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import FlashAlert, {showFlashAlert, showFlashError, showFlashSuccess, defaultTimeout} from '..'

expect.extend(toHaveNoViolations)

describe('FlashAlert', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        message: 'This is a test error message 123',
        timeout: defaultTimeout,
        error: new Error('This is a test error 321'),
        variant: 'error',
        onClose: jest.fn(),
        screenReaderOnly: false,
      },
      props
    )
  }

  describe('rendering', () => {
    let renderSpy

    beforeEach(() => {
      renderSpy = jest.spyOn(ReactDOM, 'render')
      jest.useFakeTimers()
    })

    afterEach(() => {
      renderSpy.mockRestore()
      jest.clearAllTimers()
      jest.useRealTimers()
    })

    it('renders message and error', () => {
      render(<FlashAlert {...makeProps()} />)
      expect(screen.getAllByText('This is a test error message 123').length).toBe(2)
      expect(screen.getAllByText('Details').length).toBe(2)
    })

    it('does not show loading chunk text', () => {
      render(<FlashAlert {...makeProps({error: new Error('loading chunk 123')})} />)
      expect(screen.getAllByText('This is a test error message 123').length).toBe(2)
      expect(screen.queryByText('loading chunk 123')).not.toBeInTheDocument()
    })

    it('closes after timeout', () => {
      const onClose = jest.fn()
      render(<FlashAlert {...makeProps({onClose})} />)

      jest.advanceTimersByTime(defaultTimeout)
      jest.advanceTimersByTime(1000)

      expect(onClose).toHaveBeenCalled()
    })

    it('renders with correct variant', () => {
      const {container} = render(<FlashAlert {...makeProps({variant: 'success'})} />)
      expect(container.querySelector('svg[name="IconCheckMark"]')).toBeInTheDocument()
    })

    it('renders as screenReaderOnly when specified', () => {
      render(<FlashAlert {...makeProps({screenReaderOnly: true})} />)
      expect(screen.getAllByText('This is a test error message 123').length).toBe(1)
    })

    describe('showFlashAlert', () => {
      it('renders flash alert', () => {
        const props = makeProps()
        showFlashAlert({...props})
        expect(renderSpy).toHaveBeenCalled()

        const container = document.getElementById('flashalert_message_holder')
        expect(container).not.toBeNull()
      })
    })

    describe('showFlashError', () => {
      it('renders error alert', () => {
        const showAlert = showFlashError()
        showAlert(new Error('Test error'))
        expect(renderSpy).toHaveBeenCalled()

        jest.advanceTimersByTime(0)
      })
    })

    describe('showFlashSuccess', () => {
      it('renders success alert', () => {
        const showAlert = showFlashSuccess('Success message')
        showAlert()
        expect(renderSpy).toHaveBeenCalled()

        jest.advanceTimersByTime(0)
      })
    })
  })

  it('meets a11y standards', async () => {
    const {container} = render(<FlashAlert {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
