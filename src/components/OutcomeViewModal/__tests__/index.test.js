import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeViewModal from '../index'
import { Provider } from 'react-redux'
import createMockStore from '../../../test/createMockStore'
import { fromJS } from 'immutable'
import OutcomeView from '../../OutcomeView'

describe('OutcomeViewModal', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: {
        label: 'Foo',
        title: 'Bar',
        scoring_method: {
          scoring_tiers: [{description: 'it brings a tier to your eye', points: 100}]
        }
      },
      closeAlignment: sinon.spy(),
      isOpen: true
    }, props)
  }

  const store = createMockStore(fromJS({}))

  it('displays when isOpen true', () => {
    const wrapper = shallow(<OutcomeViewModal {...makeProps()} />)
    const modal = wrapper.find('Modal')
    expect(modal.prop('open')).to.be.true
  })

  it('does not display when isOpen false', () => {
    const wrapper = shallow(<OutcomeViewModal {...makeProps()} isOpen={false} />)
    const modal = wrapper.find('Modal')
    expect(modal.prop('open')).to.be.false
  })

  it('calls closeAlignment on close', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomeViewModal {...props} />)
    const modal = wrapper.find('Modal')
    modal.simulate('close')
    expect(props.closeAlignment.calledWith()).to.be.true
  })

  it('calls closeAlignment on requestClose', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomeViewModal {...props} />)
    const modal = wrapper.find('Modal')
    modal.simulate('dismiss')
    expect(props.closeAlignment.calledWith()).to.be.true
  })

  it('includes a close button in the footer', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomeViewModal {...props} />)
    const closeButton = wrapper.find('ModalFooter Button')
    expect(closeButton.length).to.equal(1)

    closeButton.simulate('click')
    expect(props.closeAlignment.calledWith()).to.be.true
  })

  it('uses standard header', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomeViewModal {...props} />)
    const txt = wrapper.find('ModalHeader Heading Text')
    expect(txt.render().text()).to.equal('View Outcome')
  })

  it('uses provided header', () => {
    const props = makeProps({header: 'Overriding'})
    const wrapper = shallow(<OutcomeViewModal {...props} />)
    const txt = wrapper.find('ModalHeader Heading Text')
    expect(txt.render().text()).to.equal('Overriding')
  })

  it('renders an outcome view when loaded', () => {
    const props = makeProps()
    const wrapper = mount(
      <Provider store={store}>
        <OutcomeViewModal {...props} />
      </Provider>
    )
    expect(wrapper.find(OutcomeView)).to.have.length(1)
  })
})
