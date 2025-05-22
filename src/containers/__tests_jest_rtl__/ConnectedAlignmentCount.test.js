import React from 'react'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore_jest_rtl'
import ConnectedAlignmentCount from '../ConnectedAlignmentCount'

describe('ConnectedAlignmentCount', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        alignments: {
          alignedOutcomes: [
            { id: 1 },
            { id: 2 }
          ]
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedAlignmentCount
          scope="scopeForTest"
          addModal={<div />}
        />
      </Provider>
    )

    // Check for the presence of "(2)" in the rendered output
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument()
  })
})
