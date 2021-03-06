import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
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

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAlignmentLabels
          scope="scopeForTest"
        />
      </Provider>
    )
    expect(wrapper.find('OutcomeLabels')).to.have.length(1)
    expect(wrapper.text()).to.match(/baz,woz/)
  })
})
