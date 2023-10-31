import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedOutcomeTray from '../ConnectedOutcomeTray'

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
    //
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedOutcomeTray
          scope="scopeForTest"
        />
      </Provider>
    )
    // Enzyme finds two OutcomeTray components because of the instui decorator on the component
    expect(wrapper.find('OutcomeTray')).to.have.length(2)
  })
})
