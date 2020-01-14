import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedAlignmentList from '../ConnectedAlignmentList'

describe('ConnectedAlignmentList', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      OutcomePicker: {
        state: 'loading',
        scope: 'scopeForTest',
      }
    }))
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAlignmentList
          scope="scopeForTest"
          addModal={<div />}
        />
      </Provider>
    )
    expect(wrapper.find('AlignmentList')).to.have.length(1)
  })
})
