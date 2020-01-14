import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import { IconOutcomesLine } from '@instructure/ui-icons'
import Alignment from '../index'
import checkA11y from '../../../test/checkA11y'

describe('Alignment', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: {
        id: '1',
        label: 'FOO',
        title: 'User can foo a bar'
      },
      closeAlignment: sinon.spy(),
      viewAlignment: sinon.spy(),
      removeAlignment: sinon.spy(),
      isOpen: false,
      readOnly: false
    }, props)
  }

  it('includes an icon', () => {
    const wrapper = shallow(<Alignment {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconOutcomesLine)).to.have.length(1)
  })

  it('includes a delete button', () => {
    const props = makeProps()
    const wrapper = shallow(<Alignment {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Button')).to.have.length(1)
  })

  it('does not include a delete button if readOnly', () => {
    const props = makeProps({ readOnly: true })
    const wrapper = shallow(<Alignment {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Button')).to.have.length(0)
  })

  it('calls removeAlignment when delete is clicked', () => {
    const props = makeProps()
    const wrapper = shallow(<Alignment {...props} />, {disableLifecycleMethods: true})
    const remove = wrapper.find('Button')
    remove.simulate('click')

    expect(props.removeAlignment.calledOnce).to.be.true
  })

  it('calls viewAlignment when the title is clicked', () => {
    const props = makeProps()
    const wrapper = shallow(<Alignment {...props} />, {disableLifecycleMethods: true})
    const link = wrapper.find('Link')
    link.simulate('click')

    expect(props.viewAlignment.calledOnce).to.be.true
  })

  it('renders outcome title in link', () => {
    const props = makeProps()
    const wrapper = mount(<Alignment {...props} />)
    const link = wrapper.find('Link')
    expect(link.text()).to.equal('User can foo a bar')
  })

  it('meets a11y standards', () => {
    return checkA11y(<Alignment {...makeProps()} />, { ignores: ['listitem'] })
  })
})
