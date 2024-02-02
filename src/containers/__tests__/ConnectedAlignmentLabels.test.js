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
    // Enzyme finds two OutcomeLabels components because of the instui decorator on the component
    expect(wrapper.find('OutcomeLabels')).to.have.length(2)

    // There is a &nbsp; after the comma
    expect(wrapper.text()).to.equal('baz,\u00a0woz')
  })
})
