import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import { IconOutcomesLine, IconTrashLine } from '@instructure/ui-icons'
import { Link } from '@instructure/ui-link'
import { Text } from '@instructure/ui-text'
import Alignment from '../index'
import checkA11y from '../../../test/checkA11y'
import {Pill} from '@instructure/ui-pill'
import {Tooltip} from '@instructure/ui-tooltip'

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
      readOnly: false,
      scope: 'artifactType:artifactId',
      index: 0
    }, props)
  }

  it('shows source context name', () => {
    const props = makeProps({
      outcome: {
        id: '1',
        label: 'FOO',
        title: 'User can foo a bar',
        source_context_info: { name: 'Source Context' }
      }
    })
    const wrapper = mount(<Alignment {...props} />, {disableLifecycleMethods: true})
    const link = wrapper.find(Text).last()
    expect(link.text()).to.equal('Source Context')
  })

  it('handles null source context name', () => {
    const props = makeProps({
      outcome: {
        id: '1',
        label: 'FOO',
        title: 'User can foo a bar',
        source_context_info: { name: null }
      }
    })
    const wrapper = mount(<Alignment {...props} />)
    const link = wrapper.find(Text).last()
    expect(link.text()).to.equal('')
  })

  it('handles null source context info', () => {
    const wrapper = mount(<Alignment {...makeProps()} />)
    const link = wrapper.find(Text).last()
    expect(link).to.have.length(1)
    expect(link.text()).to.equal('User can foo a bar')
  })

  describe('renderOutcomeDecoration', () => {
    function getDecoratedOutcome(decorator) {
      return makeProps({
        outcome: {
          id: '1',
          label: 'FOO',
          title: 'User can foo a bar',
          source_context_info: {name: null},
          decorator: decorator
        }
      })
    }

    it('does not decorate if there is no decorator', () => {
      const wrapper = mount(<Alignment {...makeProps()} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(0)
    })


    it('does not decorate if decorator is HIDE', () => {
      const props = getDecoratedOutcome('HIDE')
      const wrapper = mount(<Alignment {...props} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(0)
    })

    it('decorates if decorator is SUB_ACCOUNT_OUTCOME', () => {
      const props = getDecoratedOutcome('SUB_ACCOUNT_OUTCOME')
      const wrapper = mount(<Alignment {...props} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(1)
      expect(pill.props().color).to.equal('primary')
      expect(pill.text()).to.equal('Sub-Account Outcome')

      const tip = wrapper.find(Tooltip).last()
      expect(tip).to.have.length(0)
    })

    it('decorates if decorator is NOT_IN_SUB_ACCOUNT', () => {
      const props = getDecoratedOutcome('NOT_IN_SUB_ACCOUNT')
      const wrapper = mount(<Alignment {...props} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(1)
      expect(pill.props().color).to.equal('danger')
      expect(pill.text()).to.equal('Not in this Sub-Account')

      const tip = wrapper.find(Tooltip).last()
      expect(tip).to.have.length(1)
      expect(tip.props().renderTip).to.equal('To add this outcome, navigate to the Outcomes Management page.')
    })

    it('decorates if decorator is COURSE_OUTCOME', () => {
      const props = getDecoratedOutcome('COURSE_OUTCOME')
      const wrapper = mount(<Alignment {...props} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(1)
      expect(pill.props().color).to.equal('primary')
      expect(pill.text()).to.equal('Course Outcome')

      const tip = wrapper.find(Tooltip).last()
      expect(tip).to.have.length(0)
    })

    it('decorates if decorator is NOT_IN_COURSE', () => {
      const props = getDecoratedOutcome('NOT_IN_COURSE')
      const wrapper = mount(<Alignment {...props} />)
      const pill = wrapper.find(Pill).last()
      expect(pill).to.have.length(1)
      expect(pill.props().color).to.equal('danger')
      expect(pill.text()).to.equal('Not in this Course')

      const tip = wrapper.find(Tooltip).last()
      expect(tip).to.have.length(1)
      expect(tip.props().renderTip).to.equal('To add this outcome, navigate to the Outcomes Management page.')
    })
  })

  it('includes an icon', () => {
    const wrapper = mount(<Alignment {...makeProps()} />)
    expect(wrapper.find(IconOutcomesLine)).to.have.length(1)
  })

  it('includes a delete button', () => {
    const props = makeProps()
    const wrapper = mount(<Alignment {...props} />)
    expect(wrapper.find(IconTrashLine)).to.have.length(1)
  })

  it('does not include a delete button if readOnly', () => {
    const props = makeProps({ readOnly: true })
    const wrapper = shallow(<Alignment {...props} />)
    expect(wrapper.find('Button')).to.have.length(0)
  })

  it('calls removeAlignment when delete is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<Alignment {...props} />, {disableLifecycleMethods: true})
    const remove = wrapper.find(IconTrashLine)
    remove.simulate('click')

    expect(props.removeAlignment.calledOnce).to.be.true
  })

  it('calls viewAlignment when the title is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<Alignment {...props} />, {disableLifecycleMethods: true})
    const link = wrapper.find(Link)
    link.simulate('click')

    expect(props.viewAlignment.calledOnce).to.be.true
  })

  it('renders outcome title in link', () => {
    const props = makeProps()
    const wrapper = mount(<Alignment {...props} />)
    const link = wrapper.find(Link)
    expect(link.text()).to.equal('User can foo a bar')
  })

  it('meets a11y standards', () => {
    return checkA11y(<Alignment {...makeProps()} />, { ignores: ['listitem'] })
  })
})
