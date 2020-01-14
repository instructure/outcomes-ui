import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedOutcomePickerModal from '../ConnectedOutcomePickerModal'

describe('ConnectedOutcomePickerModal', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      OutcomePicker: {
        state: 'loading',
        scope: 'scopeForTest',
      }
    }))
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedOutcomePickerModal
          outcomePicker={<div />}
          scope="scopeForTest"
        />
      </Provider>
    )
    expect(wrapper.find('OutcomePickerModal')).to.have.length(1)
  })
})
