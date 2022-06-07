import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import AlignmentWidget from '../index'
import checkA11y from '../../../test/checkA11y'
import { OUTCOME_1, OUTCOME_2, OUTCOME_3 } from '../../../test/mockOutcomesData'

describe('AlignmentWidget', () => {
  function makeProps (props = {}) {
    return Object.assign({
      alignedOutcomes: [OUTCOME_1, OUTCOME_2, OUTCOME_3],
      tray: () => <div className="outcomeTray" />, // eslint-disable-line react/display-name
      scope: 'scopeForTest',
      openOutcomePicker: sinon.spy(),
      removeAlignment: sinon.spy(),
      onUpdate: sinon.spy(),
      screenreaderNotification: sinon.spy()
    }, props)
  }

  it('renders a button with a11y components', () => {
    const wrapper = shallow(<AlignmentWidget {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Button[data-automation="alignmentWidget__button"]')).to.have.length(1)
    expect(wrapper.find('AccessibleContent')).to.have.length(1)
  })

  it('does not render an alignment button if canManageOutcomes is false', () => {
    const wrapper = shallow(<AlignmentWidget {...makeProps({canManageOutcomes: false})} />,
      {disableLifecycleMethods: true})
    expect(wrapper.find('Button[data-automation="alignmentWidget__button"]')).to.have.length(0)
  })

  it('does not render header if canManageOutcomes is false and no outcomes are aligned', () => {
    const wrapper = shallow(<AlignmentWidget {...makeProps({canManageOutcomes: false, alignedOutcomes: []})} />,
      {disableLifecycleMethods: true})
    expect(wrapper.find('Text')).to.have.length(0)
    expect(wrapper.find('IconOutcomesLine')).to.have.length(0)
    expect(wrapper.find('AlignmentCount')).to.have.length(0)
  })

  it('disables the expansion toggle button if no outcomes are aligned', () => {
    const wrapper = shallow(<AlignmentWidget {...makeProps({alignedOutcomes: []})} />,
      {disableLifecycleMethods: true})
    const buttonStyle = wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').props('style')
    expect(buttonStyle.interaction).to.equal('disabled')
  })

  it('renders the alignment list collapsed by default', () => {
    const wrapper = mount(<AlignmentWidget {...makeProps()} />)
    expect(wrapper.find('AlignmentItem')).to.have.length(0)
  })

  it('expansion toggle click is correctly handled', () => {
    const wrapper = mount(<AlignmentWidget {...makeProps()} />)
    wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
    expect(wrapper.find('AlignmentItem')).to.have.length(3)
    expect(wrapper.find('ScreenReaderContent').at(0).text()).to.eq('Collapse the list of aligned Outcomes')
    expect(wrapper.find('IconArrowOpenDownLine')).to.have.length(1)
  })

  it('collapse toggle button click is correctly handled', () => {
    const wrapper = mount(<AlignmentWidget {...makeProps()} />)
    wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
    wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
    expect(wrapper.find('AlignmentItem')).to.have.length(0)
    expect(wrapper.find('ScreenReaderContent').at(0).text()).to.eq('Expand the list of aligned Outcomes')
    expect(wrapper.find('IconArrowOpenEndLine')).to.have.length(1)
  })

  it('calls openOutcomePicker when the button is pressed', () => {
    const props = makeProps()
    const wrapper = shallow(<AlignmentWidget {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Button[data-automation="alignmentWidget__button"]').simulate('click')
    expect(props.openOutcomePicker.calledOnce).to.be.true
  })

  it('renders AlignmentItems for each aligned outcome', () => {
    const wrapper = mount(<AlignmentWidget {...makeProps()} />)
    wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
    expect(wrapper.find('AlignmentItem')).to.have.length(3)
  })

  it('renders an AlignmentCount object', () => {
    const wrapper = mount(<AlignmentWidget {...makeProps()} />)
    expect(wrapper.find('AlignmentCount')).to.have.length(1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentWidget {...makeProps()} />)
  })

  describe('when an alignment is removed', () => {
    it('calls the removeAlignment action with shouldUpdateArtifact equal to true', () => {
      const props = makeProps()
      const wrapper = mount(<AlignmentWidget {...props} />)
      wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
      const first = wrapper.find('AlignmentItem').at(0)
      const remove = first.prop('removeAlignment')
      const outcome = first.prop('outcome')
      remove()
      expect(props.removeAlignment.getCall(0).args).to.include(outcome.id, true)
    })

    it('focuses on the previous alignment when the second alignment deleted', () => {
      const wrapper = mount(<AlignmentWidget {...makeProps()} />)
      wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
      const next = wrapper.find('AlignmentItem').at(1)
      const remove = next.prop('removeAlignment')
      remove()
      expect(wrapper.state().focusedItem).to.eq(0)
    })

    it('focuses on the next alignment when first alignment deleted', () => {
      const wrapper = mount(<AlignmentWidget {...makeProps()} />)
      wrapper.find('IconButton[data-automation="alignmentWidget__collapseButton"]').simulate('click')
      const first = wrapper.find('AlignmentItem').at(0)
      const remove = first.prop('removeAlignment')
      remove()
      expect(wrapper.state().focusedItem).to.eq(1)
    })
  })

  describe('componentDidUpdate', () => {
    it('shifts focus to the |+Outcome| Button when alignments are removed', (done) => {
      const outcomes = { alignedOutcomes: [{ id: '1', label: 'A1', title: 'tA1' }] }
      const wrapper = mount(<AlignmentWidget {...makeProps(outcomes)} />)

      const trigger = wrapper.find('Button[data-automation="alignmentWidget__button"]').last()
      const focus = sinon.spy(trigger.instance(), 'focus')
      wrapper.setProps({alignedOutcomes: []}, () => {
        expect(wrapper.find('Button[data-automation="alignmentWidget__button"]')).to.have.length(1)
        expect(focus.calledOnce).to.be.true
        expect(focus.calledWith()).to.be.true
        done()
      })
    })
  })
})
