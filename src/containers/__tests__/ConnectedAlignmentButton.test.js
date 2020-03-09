import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedAlignmentButton from '../ConnectedAlignmentButton'

describe('ConnectedAlignmentButton', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      OutcomePicker: {
        state: 'loading',
        scope: 'scopeForTest',
      }
    }))
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAlignmentButton
          tray={<div />}
        />
      </Provider>
    )
    expect(wrapper.find('AlignmentButton')).to.have.length(1)
  })
})
