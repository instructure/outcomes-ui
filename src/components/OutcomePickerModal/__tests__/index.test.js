import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomePickerModal from '../index'
import {Provider} from 'react-redux'
import createMockStore from '../../../test/createMockStore_jest_rtl'
import {fromJS} from 'immutable'

expect.extend(toHaveNoViolations)

describe('OutcomePickerModal', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        outcomePickerState: 'choosing',
        outcomePicker: () => <div data-testid="outcome-picker">Outcome Picker Component</div>,
        resetOutcomePicker: jest.fn(),
        closeOutcomePicker: jest.fn(),
        loadOutcomePicker: jest.fn(),
        setFocusedOutcome: jest.fn(),
        onModalOpen: jest.fn(),
        onModalClose: jest.fn(),
        setSearchText: jest.fn(),
        onUpdate: jest.fn(),
        anyOutcomeSelected: false,
        saveOutcomePickerAlignments: jest.fn().mockResolvedValue({}),
        scope: 'scopeForTest',
      },
      props
    )
  }

  function renderWithProvider(props) {
    const store = createMockStore(
      fromJS({
        scopeForTest: {
          config: {
            contextUuid: 'test-context-uuid',
          },
        },
        context: {
          contexts: {
            'test-context-uuid': {
              loading: false,
              data: {},
            },
          },
        },
      })
    )

    return render(
      <Provider store={store}>
        <OutcomePickerModal {...props} />
      </Provider>
    )
  }

  it('renders a modal', () => {
    renderWithProvider(makeProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders modal closed when state is closed', () => {
    const props = makeProps({outcomePickerState: 'closed'})
    const {container} = renderWithProvider(props)
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
  })

  it('renders modal open when state is not closed', () => {
    renderWithProvider(makeProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('triggers onModalOpen on modal open', async () => {
    const props = makeProps()
    renderWithProvider(props)
    await waitFor(() => {
      expect(props.onModalOpen).toHaveBeenCalledTimes(1)
    })
  })

  it('closes modal on dismiss', () => {
    const props = makeProps()
    renderWithProvider(props)

    const closeButton = screen.getByTestId('outcomePicker__cancelButton')
    fireEvent.click(closeButton)

    expect(props.closeOutcomePicker).toHaveBeenCalledTimes(1)
  })

  it('shows "Confirm Alignments" when picker in choosing state and an outcome is selected', () => {
    const props = makeProps({outcomePickerState: 'choosing', anyOutcomeSelected: true})
    renderWithProvider(props)

    const submitButton = screen.getByRole('button', {name: /Confirm Alignments/i})
    expect(submitButton).toBeInTheDocument()
  })

  it('shows "Done" when picker in choosing state and no outcome is selected', () => {
    const props = makeProps({outcomePickerState: 'choosing', anyOutcomeSelected: false})
    renderWithProvider(props)

    const submitButton = screen.getByTestId('outcomePicker__submitButton')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Done')
  })

  it('shows "OK" when picker in complete state', () => {
    const props = makeProps({outcomePickerState: 'complete'})
    renderWithProvider(props)

    const submitButton = screen.getByTestId('outcomePicker__submitButton')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('OK')
  })

  it('has submit and cancel buttons disabled when picker in loading state', () => {
    const props = makeProps({outcomePickerState: 'loading'})
    renderWithProvider(props)

    const submitButton = screen.getByTestId('outcomePicker__submitButton')
    const cancelButton = screen.getByTestId('outcomePicker__cancelButton')

    expect(submitButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('has submit and cancel buttons disabled when picker in saving state', () => {
    const props = makeProps({outcomePickerState: 'saving'})
    renderWithProvider(props)

    const submitButton = screen.getByTestId('outcomePicker__submitButton')
    const cancelButton = screen.getByTestId('outcomePicker__cancelButton')

    expect(submitButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('saves outcome alignments when Confirm Alignments is pressed', () => {
    const props = makeProps({outcomePickerState: 'choosing', anyOutcomeSelected: true})
    renderWithProvider(props)

    const submitButton = screen.getByRole('button', {name: /Confirm Alignments/i})
    fireEvent.click(submitButton)

    expect(props.saveOutcomePickerAlignments).toHaveBeenCalledWith(props.onUpdate)
  })

  it('closes modal when Confirm Alignments is complete', async () => {
    const props = makeProps({outcomePickerState: 'choosing', anyOutcomeSelected: true})
    renderWithProvider(props)

    const submitButton = screen.getByRole('button', {name: /Confirm Alignments/i})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(props.closeOutcomePicker).toHaveBeenCalled()
    })
  })

  it('does not save outcome alignments when Cancel is pressed', () => {
    const props = makeProps({outcomePickerState: 'choosing'})
    renderWithProvider(props)

    const cancelButton = screen.getByTestId('outcomePicker__cancelButton')
    fireEvent.click(cancelButton)

    expect(props.saveOutcomePickerAlignments).not.toHaveBeenCalled()
  })

  it('triggers closeOutcomePicker on Cancel button click', () => {
    const props = makeProps({outcomePickerState: 'choosing'})
    renderWithProvider(props)

    const cancelButton = screen.getByTestId('outcomePicker__cancelButton')
    fireEvent.click(cancelButton)

    expect(props.closeOutcomePicker).toHaveBeenCalled()
  })

  it('meets a11y standards', async () => {
    const {container} = renderWithProvider(makeProps())
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
