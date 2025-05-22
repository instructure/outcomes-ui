import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import ConnectedAlignmentList from '../ConnectedAlignmentList'

// eslint-disable-next-line react/display-name
jest.mock('../../components/AlignmentList', () => props => {
  return (
    <div>
      <p>AlignmentList</p>
      <p>{props.scope}</p>
      <p data-testid="add-modal">{props.addModal ? 'Has Add Modal' : 'No Add Modal'}</p>
    </div>
  )
})

describe('ConnectedAlignmentList', () => {
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
        <ConnectedAlignmentList
          scope="scopeForTest"
          addModal={<div />}
        />
      </Provider>
    )

    expect(screen.getByText('AlignmentList')).toBeInTheDocument()
    expect(screen.getByText('scopeForTest')).toBeInTheDocument()
    expect(screen.getByTestId('add-modal')).toHaveTextContent('Has Add Modal')
  })
})
