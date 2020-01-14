import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import checkA11y from '../../../test/checkA11y'
import OutcomePickerModal from '../index'

describe('OutcomePickerModal', () => {
  const primaryButtonSelector = 'Button[variant="primary"]'
  const cancelButtonSelector = 'Button[variant="default"]'

  function makeProps (props = {}) {
    return Object.assign({
      outcomePickerState: 'choosing',
      outcomePicker: () => <div className="outcomePicker" />, // eslint-disable-line react/display-name
      resetOutcomePicker: sinon.spy(),
      loadOutcomePicker: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      onModalOpen: sinon.spy(),
      onModalClose: sinon.spy(),
      setSearchText: sinon.spy(),
      onUpdate: sinon.spy(),
      anyOutcomeSelected: false,
      saveOutcomePickerAlignments: sinon.stub().returns(Promise.resolve()),
      scope: 'scopeForTest'
    }, props)
  }

  it('renders a modal', () => {
    const wrapper = shallow(<OutcomePickerModal {...makeProps()} />)
    expect(wrapper.find('Modal')).to.have.length(1)
  })

  it('renders modal closed by when state is closed', () => {
    const props = makeProps({ outcomePickerState: 'closed' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find('Modal').prop('open')).to.be.false
  })

  it('renders modal open when state not closed', () => {
    const wrapper = shallow(<OutcomePickerModal {...makeProps()} />)
    expect(wrapper.find('Modal').prop('open')).to.be.true
  })

  it('triggers onModalOpen on modal open', (done) => {
    const props = makeProps()
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find('Modal').simulate('open')
    setTimeout(() => {
      expect(props.onModalOpen.calledOnce).to.be.true
      done()
    }, 1)
  })

  it('closes modal on requestClose', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find('Modal').simulate('dismiss')
    expect(props.resetOutcomePicker.calledOnce).to.be.true
  })

  it('calls focus on the trigger element when modal dismissed', () => {
    const props = makeProps({ trigger: { focus: sinon.stub() } })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find('Modal').simulate('close')
    expect(props.trigger.focus.called).to.be.true
  })

  it('shows "Align Selected" when picker in choosing state and an outcome is selected', () => {
    const props = makeProps({ outcomePickerState: 'choosing', anyOutcomeSelected: true })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find(primaryButtonSelector).childAt(0).text()).to.equal('Align Selected')
  })

  it('shows "Done" when picker in choosing state and no outcome is selected', () => {
    const props = makeProps({ outcomePickerState: 'choosing', anyOutcomeSelected: false })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find(primaryButtonSelector).childAt(0).text()).to.equal('Done')
  })

  it('shows "OK" when picker in complete state', () => {
    const props = makeProps({ outcomePickerState: 'complete' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find(primaryButtonSelector).childAt(0).text()).to.equal('OK')
  })

  it('has Done and Cancel buttons disabled when picker in loading state', () => {
    const props = makeProps({ outcomePickerState: 'loading' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find(primaryButtonSelector).childAt(0).text()).to.equal('Done')
    wrapper.find('ModalFooter Button').forEach((btn) => {
      expect(btn.prop('disabled')).to.equal(true)
    })
  })

  it('has OK and Cancel buttons disabled when picker in saving state', () => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    expect(wrapper.find(primaryButtonSelector).childAt(0).text()).to.equal('OK')
    wrapper.find('ModalFooter Button').forEach((btn) => {
      expect(btn.prop('disabled')).to.equal(true)
    })
  })

  it('saves outcome alignments when Align Selected is pressed', () => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find(primaryButtonSelector).simulate('click')
    expect(props.saveOutcomePickerAlignments.calledOnce).to.be.true
    expect(props.saveOutcomePickerAlignments.calledWith(props.onUpdate)).to.be.true
  })

  it('closes modal when Align Selected is complete', (done) => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find(primaryButtonSelector).simulate('click')
    setTimeout(() => {
      expect(props.resetOutcomePicker.called).to.be.true
      done()
    }, 1)
  })

  it('triggers onModalClose on modal close', (done) => {
    const props = makeProps({ outcomePickerState: 'closed' })
    const wrapper = mount(<OutcomePickerModal {...props} />)
    wrapper.find('Modal').prop('onClose')()
    setTimeout(() => {
      expect(props.onModalClose.calledOnce).to.be.true
      done()
    }, 1)
  })

  it('does not save outcome alignments when Cancel is pressed', () => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find(cancelButtonSelector).simulate('click')
    expect(props.saveOutcomePickerAlignments.called).to.be.false
  })

  it('resets modal state when Cancel is pressed', () => {
    const props = makeProps({ outcomePickerState: 'saving' })
    const wrapper = shallow(<OutcomePickerModal {...props} />)
    wrapper.find(cancelButtonSelector).simulate('click')
    expect(props.resetOutcomePicker.called).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomePickerModal {...makeProps()} />)
  })
})
