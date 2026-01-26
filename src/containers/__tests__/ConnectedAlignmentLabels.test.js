import React from 'react'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore_jest_rtl'
import ConnectedAlignmentLabels from '../ConnectedAlignmentLabels'

describe('ConnectedAlignmentLabels', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        alignments: {
          alignedOutcomes: [
            { id: 1, label: 'foo', title: 'baz' },
            { id: 2, label: 'bar', title: 'woz' }
          ]
        }
      }
    }))

    render(
      <Provider store={store}>
        <ConnectedAlignmentLabels
          scope="scopeForTest"
        />
      </Provider>
    )

    // Check that the text content is rendered correctly
    // There is a non-breaking space after the comma
    expect(screen.getByText('baz')).toBeInTheDocument()
    expect(screen.getByText('woz')).toBeInTheDocument()
  })
})
