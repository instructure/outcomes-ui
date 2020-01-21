import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedOutcomePicker from '../ConnectedOutcomePicker'

describe('ConnectedOutcomePicker', () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedOutcomePicker contextUuid="course_100" scope="scopeForTest" />
      </Provider>
    )
    expect(wrapper.find('OutcomePicker')).to.have.length(1)
  })
})
