import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedAlignmentCount from '../ConnectedAlignmentCount'
import AlignmentCount from '../../components/AlignmentCount'

describe('ConnectedAlignmentCount', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scopeForTest: {
        alignments: {
          alignedOutcomes: [
            { id: 1 },
            { id: 2 }
          ]
        }
      }
    }))

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAlignmentCount
          scope="scopeForTest"
          addModal={<div />}
        />
      </Provider>
    )
    expect(wrapper.find(AlignmentCount)).to.have.length(1)
    expect(wrapper.text()).to.match(/\(2\)/)
  })
})
