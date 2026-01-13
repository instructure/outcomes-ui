import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedAlignmentWidget from '../ConnectedAlignmentWidget'

// eslint-disable-next-line react/display-name
jest.mock('../../components/AlignmentWidget', () => props => {
  return (
    <div>
      <p>AlignmentWidget</p>
      <p data-testid="tray">{props.tray ? 'Has Tray' : 'No Tray'}</p>
    </div>
  )
})

describe('ConnectedAlignmentWidget', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        OutcomePicker: {
          state: 'loading',
          scope: 'scopeForTest',
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedAlignmentWidget
          tray={<div />}
          scope="scopeForTest"
        />
      </Provider>
    )

    expect(screen.getByText('AlignmentWidget')).toBeInTheDocument()
    expect(screen.getByTestId('tray')).toHaveTextContent('Has Tray')
  })
})
