import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedOutcomePickerModal from '../ConnectedOutcomePickerModal'

// eslint-disable-next-line react/display-name
jest.mock('../../components/OutcomePickerModal', () => props => {
  return (
    <div>
      <p>OutcomePickerModal</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('ConnectedOutcomePickerModal', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        OutcomePicker: {
          state: 'loading',
          scope: 'scopeForTest'
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedOutcomePickerModal
          outcomePicker={<div />}
          scope="scopeForTest"
        />
      </Provider>
    )

    expect(screen.getByText('OutcomePickerModal')).toBeInTheDocument()
    expect(screen.getByText('scopeForTest')).toBeInTheDocument()
  })
})
