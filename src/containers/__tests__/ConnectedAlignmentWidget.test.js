import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedAlignmentWidget from '../ConnectedAlignmentWidget'

describe('ConnectedAlignmentWidget', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      OutcomePicker: {
        state: 'loading',
        scope: 'scopeForTest',
      }
    }))
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAlignmentWidget
          tray={<div />}
        />
      </Provider>
    )
    expect(wrapper.find('AlignmentWidget')).to.have.length(1)
  })
})
