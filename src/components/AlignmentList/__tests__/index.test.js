import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import AlignmentList from '../index'
import checkA11y from '../../../test/checkA11y'

describe('AlignmentList', () => {
  const triggerButtonSelector = 'Button[variant="circle-primary"]'

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
    }, props)
  }

  describe('no alignments present', () => {
    const props = makeProps({ alignedOutcomes: [] })

    it('shows billboard when no alignments present', () => {
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Billboard')).to.have.length(1)
    })

    it('does not show the billboard when readOnly is true', () => {
      const props = makeProps({ alignedOutcomes: [], readOnly: true })
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Billboard')).to.have.length(0)
    })

    it('includes the right heading', () => {
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Billboard').prop('heading')).to.equal('Foo')
    })

    it('launches modal when billboard clicked', () => {
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      wrapper.find('Billboard').simulate('click')
      expect(props.openOutcomePicker.calledOnce).to.be.true
    })

    it('focuses the billboard button when focus called', (done) => {
      const wrapper = mount(<AlignmentList {...props} />)
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
      const wrapper = shallow(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find('ul')).to.have.length(1)
    })

    it('adds one alignment row per alignment', () => {
      const wrapper = shallow(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Alignment')).to.have.length(3)
    })

    it('gives correct outcome to alignment rows', () => {
      const wrapper = shallow(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find('Alignment').last().prop('outcome')).to.have.property('label', 'C3')
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
      const wrapper = shallow(<AlignmentList {...makeProps()} />, {disableLifecycleMethods: true})
      expect(wrapper.find(triggerButtonSelector)).to.have.length(1)
    })

    it('does not render a trigger button when readOnly is true', () => {
      const wrapper = shallow(<AlignmentList {...makeProps({ readOnly: true })} />, {disableLifecycleMethods: true})
      expect(wrapper.find(triggerButtonSelector)).to.have.length(0)
    })

    it('launches modal when trigger button clicked', () => {
      const props = makeProps()
      const wrapper = shallow(<AlignmentList {...props} />, {disableLifecycleMethods: true})
      wrapper.find(triggerButtonSelector).simulate('click')
      expect(props.openOutcomePicker.calledOnce).to.be.true
    })

    it('focuses the add button when modal dismissed', (done) => {
      const wrapper = mount(<AlignmentList {...makeProps()} />)
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
      const { label } = first.instance().props.outcome
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
        const first = wrapper.find('Alignment').at(0)
        const next = wrapper.find('Alignment').at(1)
        const focus = sinon.spy(next.instance(), 'focus')
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
})
