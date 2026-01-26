import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedOutcomeTray from '../ConnectedOutcomeTray'

// eslint-disable-next-line react/display-name
jest.mock('../../components/OutcomeTray', () => props => {
  return (
    <div>
      <p>OutcomeTray</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('ConnectedOutcomeTray', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        OutcomePicker: {
          state: 'loading',
          search: {
            searchText: 'testing',
            isLoading: false,
            entries: []
          },
          scope: 'scopeForTest',
          focusedOutcome: null
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedOutcomeTray
          scope="scopeForTest"
        />
      </Provider>
    )

    expect(screen.getByText('OutcomeTray')).toBeInTheDocument()
    expect(screen.getByText('scopeForTest')).toBeInTheDocument()
  })
})
