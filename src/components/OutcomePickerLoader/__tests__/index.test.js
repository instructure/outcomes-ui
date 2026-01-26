import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomePickerLoader from '../index'
import {Provider} from 'react-redux'
import createMockStore from '../../../test/createMockStore_jest_rtl'
import {fromJS} from 'immutable'

expect.extend(toHaveNoViolations)

describe('OutcomePickerLoader', () => {
  function DummyComponent() {
    return <div data-testid="dummy-component">Dummy Component</div>
  }

  function makeProps(props = {}) {
    return Object.assign(
      {
        outcomePicker: DummyComponent,
        loadOutcomePicker: jest.fn(),
        setFocusedOutcome: jest.fn(),
        outcomePickerState: 'closed',
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
        <OutcomePickerLoader {...props} />
      </Provider>
    )
  }

  it('calls loadOutcomePicker on mount', () => {
    const props = makeProps()
    renderWithProvider(props)
    expect(props.loadOutcomePicker).toHaveBeenCalledTimes(1)
  })

  it('displays nothing when closed', () => {
    const {container} = renderWithProvider(makeProps())
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('displays a spinner while loading', () => {
    const props = makeProps({outcomePickerState: 'loading'})
    renderWithProvider(props)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('displays the outcome picker while choosing', () => {
    const props = makeProps({outcomePickerState: 'choosing'})
    renderWithProvider(props)
    expect(screen.getByTestId('dummy-component')).toBeInTheDocument()
  })

  it('displays a spinner while saving', () => {
    const props = makeProps({outcomePickerState: 'saving'})
    renderWithProvider(props)
    expect(screen.getByText('Saving')).toBeInTheDocument()
  })

  it('displays a success message while complete', () => {
    const props = makeProps({outcomePickerState: 'complete'})
    renderWithProvider(props)
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = renderWithProvider(makeProps())
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
