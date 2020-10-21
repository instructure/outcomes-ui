/* eslint-disable no-console */
import { expect } from 'chai'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'
import createMockStore from '../../test/createMockStore'
import ConnectedOutcomeView from '../ConnectedOutcomeView'

describe('ConnectedOutcomeView', () => {
  it('renders', () => {
    const store = createMockStore(fromJS({
      scope_name: {
        config: {
          contextUuid: 'dummy_1'
        }
      },
      context: {
        contexts: {
          dummy_1: {
            loading: false,
            data: {
              id: 1
            }
          }
        }
      }
    }))

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedOutcomeView
          scope='scope_name'
          description='Description'
          title='Title'
        />
      </Provider>
    )

    expect(wrapper.find('OutcomeView')).to.have.length(1)
  })
})
