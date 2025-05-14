import { expect, jest } from '@jest/globals'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import OutcomeViewModal from '../index'
import { Provider } from 'react-redux'
import createMockStore from '../../../test/createMockStore_jest_rtl'
import { fromJS } from 'immutable'

describe('OutcomeViewModal', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: {
        label: 'Foo',
        title: 'Bar',
        scoring_method: {
          scoring_tiers: [{description: 'it brings a tier to your eye', points: 100}]
        }
      },
      closeAlignment: jest.fn(),
      isOpen: true
    }, props)
  }

  it('displays when isOpen true', () => {
    const store = createMockStore(fromJS({}))
    render(<Provider store={store}><OutcomeViewModal {...makeProps()} /></Provider>)
    // Modal should be in the DOM when open prop is true
    const modalElement = screen.getByRole('dialog')
    expect(modalElement).toBeInTheDocument()
  })

  it('does not display when isOpen false', () => {
    const store = createMockStore(fromJS({}))
    render(<Provider store={store}><OutcomeViewModal {...makeProps()} isOpen={false} /></Provider>)
    // Modal should not be in the DOM when open prop is false
    const modalElement = screen.queryByRole('dialog')
    expect(modalElement).not.toBeInTheDocument()
  })

  it('calls closeAlignment on close', () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps()
    render(<Provider store={store}><OutcomeViewModal {...props} /></Provider>)

    // Trigger close event by clicking the X button
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    expect(props.closeAlignment).toHaveBeenCalled()
  })

  it('calls closeAlignment on requestClose', async () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps()
    render(<Provider store={store}><OutcomeViewModal {...props} /></Provider>)
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    expect(props.closeAlignment).toHaveBeenCalled()
  })

  it('includes a close button in the footer', () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps()
    render(<Provider store={store}><OutcomeViewModal {...props} /></Provider>)

    // Find the OK button in the footer
    const closeButton = screen.getByText('OK')
    expect(closeButton).toBeInTheDocument()

    // Click the button
    fireEvent.click(closeButton)
    expect(props.closeAlignment).toHaveBeenCalled()
  })

  it('uses standard header', () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps()
    render(<Provider store={store}><OutcomeViewModal {...props} /></Provider>)

    const headerText = screen.getByText('View Outcome')
    expect(headerText).toBeInTheDocument()
  })

  it('uses provided header', () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps({header: 'Overriding'})
    render(<Provider store={store}><OutcomeViewModal {...props} /></Provider>)

    const headerText = screen.getByText('Overriding')
    expect(headerText).toBeInTheDocument()
  })

  it('renders an outcome view when loaded', () => {
    const store = createMockStore(fromJS({}))
    const props = makeProps()

    render(
      <Provider store={store}>
        <OutcomeViewModal {...props} />
      </Provider>
    )

    // Check that the Modal is in the document with the correct data-automation attribute
    expect(screen.getByRole('dialog')).toHaveAttribute('data-automation', 'outcomeView__modal')
    expect(screen.getByText('it brings a tier to your eye')).toBeInTheDocument()
  })
})
