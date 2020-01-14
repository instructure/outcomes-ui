import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import sinon from 'sinon'
import createMockStore from '../../test/createMockStore'
import ConnectedStudentMastery from '../ConnectedStudentMastery'

describe('ConnectedStudentMastery', () => {
  it('renders', () => {
    const service = { getIndividualResults: sinon.stub().returns(Promise.resolve()) }
    const store = createMockStore(fromJS({
      scopeForTest: {
        StudentMastery: {
          state: 'closed'
        }
      }
    }), service)
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedStudentMastery
          scope="scopeForTest"
          addModal={<div />}
        />
      </Provider>
    )
    expect(wrapper.find('StudentMastery')).to.have.length(1)
  })
})
