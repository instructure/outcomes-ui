import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import AlignmentList from '../index'
import checkA11y from '../../../test/checkA11y'
import { Billboard } from '@instructure/ui-billboard'
import Alignment from '../../Alignment'
import { IconPlusLine } from '@instructure/ui-icons'

describe('AlignmentList', () => {

  function makeProps (props = {}) {
    return Object.assign({
      alignedOutcomes: [
        { id: '1', label: 'A1', title: 'tA1' },
        { id: '2', label: 'B2', title: 'tB2' },
        { id: '3', label: 'C3', title: 'tC3' }
      ],
      emptySetHeading: 'Foo',
      scope: 'scopeForTest',
      viewAlignment: sinon.spy(),
      closeAlignment: sinon.spy(),
      removeAlignment: sinon.spy(),
      onUpdate: sinon.spy(),
      isOpen: sinon.stub().returns(false),
      setOutcomePickerState: sinon.spy(),
      openOutcomePicker: sinon.spy(),
      screenreaderNotification: sinon.spy(),
      addModal: () => null,
      outcomePicker: () => null,
      readOnly: false,
      onModalClose: () => null,
    }, props)
  }

  describe('no alignments present', () => {
    const props = makeProps({ alignedOutcomes: [] })

    it('shows billboard when no alignments present', () => {
      const wrapper = mount(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find(Billboard)).to.have.length(1)
    })

    it('does not show the billboard when readOnly is true', () => {
      const props = makeProps({ alignedOutcomes: [], readOnly: true })
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Billboard')).to.have.length(0)
    })

    it('includes the right heading', () => {
      const wrapper = mount(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find(Billboard).prop('heading')).to.equal('Foo')
    })

    it('launches modal when billboard clicked', () => {
      const wrapper = mount(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      wrapper.find(Billboard)
      const billboard = wrapper.find(Billboard)
      billboard.find('button').simulate('click')
      expect(props.openOutcomePicker.calledOnce).to.be.true
    })

    it('focuses the billboard button when focus called', (done) => {
      let wrapper = mount(<AlignmentList {...props} />)
      // Enzyme finds two AlignmentList components because of the instui decorator on the component
      wrapper = wrapper.find('AlignmentList').at(1)
      setTimeout(() => {
        const trigger = wrapper.find('button').last()
        const focus = sinon.spy(trigger.instance(), 'focus')
        wrapper.instance().focus()
        setTimeout(() => {
          expect(focus.calledOnce).to.be.true
          expect(focus.calledWith()).to.be.true
          done()
        }, 1)
      }, 1)
    })

    it('meets a11y standards', () => {
      return checkA11y(<AlignmentList {...props} />)
    })
  })

  describe('alignments present', () => {
    it('shows list', () => {
      const wrapper = mount(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find('ul')).to.have.length(1)
    })

    it('adds one alignment row per alignment', () => {
      const wrapper = mount(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find(Alignment)).to.have.length(3)
    })

    it('gives correct outcome to alignment rows', () => {
      const wrapper = mount(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find(Alignment).last().prop('outcome')).to.have.property('label', 'C3')
    })

    it('gives correct callbacks to alignment rows', () => {
      const props = makeProps()
      const wrapper = mount(<AlignmentList {...props} />)
      const first = wrapper.find('Alignment').at(0)
      const remove = first.prop('removeAlignment')
      remove()
      expect(props.removeAlignment.calledWith('1', props.onUpdate)).to.be.true

      const view = first.prop('viewAlignment')
      view()
      expect(props.viewAlignment.calledWith('1')).to.be.true

      const close = first.prop('closeAlignment')
      close()
      expect(props.closeAlignment.calledWith()).to.be.true
    })

    it('renders a trigger button when readOnly is false', () => {
      const wrapper = mount(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find(IconPlusLine)).to.have.length(1)
    })

    it('does not render a trigger button when readOnly is true', () => {
      const wrapper = mount(<AlignmentList {...makeProps({ readOnly: true })} />, {disableLifecycleMethods: true})
      expect(wrapper.find(IconPlusLine)).to.have.length(0)
    })

    it('launches modal when trigger button clicked', () => {
      const props = makeProps()
      const wrapper = mount(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      wrapper.find(IconPlusLine).simulate('click')
      expect(props.openOutcomePicker.calledOnce).to.be.true
    })

    it('focuses the add button when modal dismissed', (done) => {
      let wrapper = mount(<AlignmentList {...makeProps()} />)
      // Enzyme finds two AlignmentList components because of the instui decorator on the component
      wrapper = wrapper.find('AlignmentList').at(1)
      setTimeout(() => {
        const trigger = wrapper.find('button').last()
        const focus = sinon.spy(trigger.instance(), 'focus')
        wrapper.instance().focus()
        setTimeout(() => {
          expect(focus.calledOnce).to.be.true
          expect(focus.calledWith()).to.be.true
          done()
        }, 1)
      }, 1)
    })

    it('generates screenreader notification when removing an alignment', (done) => {
      const props = makeProps()
      const wrapper = mount(<AlignmentList {...props} />)
      const first = wrapper.find('Alignment').at(0)
      const { label } = first.prop('outcome')
      const remove = first.prop('removeAlignment')
      remove()
      setTimeout(() => {
        expect(props.screenreaderNotification.getCall(0).args[0]).to.include(label)
        done()
      }, 1)
    })

    it('focuses on the prior alignment when current alignment deleted', (done) => {
      const wrapper = mount(<AlignmentList {...makeProps()} />)
      setTimeout(() => {
        const last = wrapper.find('Alignment').at(2)
        const previous = wrapper.find('Alignment').at(1)
        const focus = sinon.spy(previous.instance(), 'focus')
        const remove = last.prop('removeAlignment')
        remove()
        setTimeout(() => {
          expect(focus.calledOnce).to.be.true
          expect(focus.calledWith()).to.be.true
          done()
        }, 1)
      }, 1)
    })

    it('focuses on the next alignment when first alignment deleted', (done) => {
      const wrapper = mount(<AlignmentList {...makeProps()} />)
      setTimeout(() => {
        // Enzyme finds extra Alignment components because of the instui decorator on the component
        const first = wrapper.find('Alignment').at(1)
        const focus = sinon.spy( wrapper.find('Alignment').at(3).instance(), 'focus')
        const remove = first.prop('removeAlignment')
        remove()
        setTimeout(() => {
          expect(focus.calledOnce).to.be.true
          expect(focus.calledWith()).to.be.true
          done()
        }, 1)
      }, 1)
    })

    it('meets a11y standards', () => {
      return checkA11y(<AlignmentList {...makeProps()} />)
    })
  })

  describe('outcome decoration', () => {
    it('behaves as empty if all outcomes are hidden', () => {
      const props = makeProps({
        alignedOutcomes: [
          { id: '1', label: 'A1', title: 'tA1', decorator: 'HIDE' },
          { id: '2', label: 'B2', title: 'tB2', decorator: 'HIDE' },
          { id: '3', label: 'C3', title: 'tC3', decorator: 'HIDE' }
        ]
      })
      const wrapper = mount(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find(Billboard)).to.have.length(1)
    })
  })
})
