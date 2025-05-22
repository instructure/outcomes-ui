import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedOutcomePicker from '../ConnectedOutcomePicker'

// eslint-disable-next-line react/display-name
jest.mock('../../components/OutcomePicker', () => props => {
  return (
    <div>
      <p>OutcomePicker</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('ConnectedOutcomePicker', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        OutcomePicker: {
          focusedOutcome: null,
          state: 'loading',
          activeChildren: [],
          scope: 'scopeForTest',
          search: {
            searchText: 'abc',
            pagination: {
              page: 1,
              total: null,
            },
            isLoading: true,
            entries: []
          }
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedOutcomePicker contextUuid="course_100" scope="scopeForTest" />
      </Provider>
    )

    expect(screen.getByText('OutcomePicker')).toBeInTheDocument()
    expect(screen.getByText('scopeForTest')).toBeInTheDocument()
  })
})
