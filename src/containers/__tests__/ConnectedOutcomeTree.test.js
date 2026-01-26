import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedOutcomeTree from '../ConnectedOutcomeTree'

// eslint-disable-next-line react/display-name
jest.mock('../../components/OutcomeTree', () => props => {
  return (
    <div>
      <p>OutcomeTree</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('ConnectedOutcomeTree', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        OutcomePicker: {
          focusedOutcome: null,
          state: 'loading',
          activeChildren: [],
          scope: 'scopeForTest'
        }
      }
    }))
    render(
      <Provider store={store}>
        <ConnectedOutcomeTree contextUuid="course_100" scope="scopeForTest" />
      </Provider>
    )
    expect(screen.getByText('OutcomeTree')).toBeInTheDocument()
  })
})
