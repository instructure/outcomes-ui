/* eslint-disable no-console */
import { expect, jest } from '@jest/globals'
import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore_jest_rtl'
import ConnectedOutcomeView from '../ConnectedOutcomeView'

// Mock the OutcomeView component to avoid decorator complexity
jest.mock('../../components/OutcomeView', () => {
  return function MockOutcomeView(props) {
    return (
      <div data-testid="outcome-view">
        <div data-testid="title">{props.title}</div>
        <div data-testid="description">{props.description}</div>
      </div>
    )
  }
})

describe('ConnectedOutcomeView', () => {
  it('renders with the correct props', () => {
    const store = createMockStore(fromJS({
      scope_name: {
        config: {
          contextUuid: 'dummy_1'
        }
      },
      context: {
        contexts: {
          dummy_1: {
            loading: false,
            data: {
              id: 1
            }
          }
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedOutcomeView
          scope='scope_name'
          description='Description'
          title='Title'
        />
      </Provider>
    )

    // Check that the component rendered with expected props
    expect(screen.getByTestId('outcome-view')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveTextContent('Title')
    expect(screen.getByTestId('description')).toHaveTextContent('Description')
  })
})
