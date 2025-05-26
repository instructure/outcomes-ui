import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import checkA11y from '../../../test/checkA11y'
import OutcomeTray from '../index'
import { Tray } from '@instructure/ui-tray'
import { Button, CloseButton } from '@instructure/ui-buttons'
import OutcomeList from '../OutcomeList'
import SearchResults from '../../SearchResults'
import { TextInput } from '@instructure/ui-text-input'

describe('OutcomeTray', () => {
  function makeProps (props = {}) {
    return Object.assign({
      searchText: '',
      updateSearchText: sinon.spy(),
      updateSearchPage: sinon.spy(),
      saveOutcomePickerAlignments: sinon.spy(),
      setSearchLoading: sinon.spy(),
      setSearchEntries: sinon.spy(),
      isSearchLoading: false,
      searchEntries: [],
      getOutcome: sinon.spy(),
      getOutcomeSummary: sinon.spy(),
      setActiveCollection: sinon.spy(),
      toggleExpandedIds: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: sinon.spy(),
      isOutcomeGroup: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy(),
      screenreaderNotification: sinon.spy(),
      onUpdate: sinon.spy(),
      searchTotal: 0,
      searchPage: 0,
      getOutcomesList: sinon.spy(),
      outcomes: [],
      isOpen: true,
      isFetching: false,
      scope: 'scopeForTest',
      listPage: 0,
      listTotal: 0,
      resetOutcomePicker: sinon.spy(),
      closeOutcomePicker: sinon.spy(),
      setInitialSelectedOutcomes: sinon.spy(),
      shouldModifyArtifact: false,
      showAlert: sinon.spy()
    }, props)
  }

  let wrapper
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('renders a tray', () => {
    wrapper = mount(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Tray)).to.have.length(1)
  })

  it('renders cancel and alignment button', () => {
    wrapper = mount(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Button)).to.have.length(2)
  })

  it('renders tray closed by when state is closed', () => {
    const props = makeProps({ isOpen: false })
    wrapper = mount(<OutcomeTray {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Tray).prop('open')).to.be.false
  })

  it('renders tray open when state not closed', () => {
    wrapper = mount(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Tray).prop('open')).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeTray {...makeProps()} />)
  })

  it('renders icon and list if no search text', () => {
    wrapper = mount(<OutcomeTray {...makeProps()} />)
    expect(wrapper.find('IconSearchLine')).to.have.length(1)
    expect(wrapper.find('OutcomeList')).to.have.length(1)
  })

  it('closes when close button is clicked', () => {
    const props = makeProps()
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.find(CloseButton).prop('onClick')()
    expect(props.closeOutcomePicker).to.be.calledOnce
  })

  it('shows only search results when searchText is present', () => {
    const props = makeProps({searchText: 'foo'})
    wrapper = mount(<OutcomeTray {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(SearchResults)).to.have.length(1)
    expect(wrapper.find(OutcomeList)).to.have.length(0)
  })

  it('updates search text when new search is entered', () => {
    const props = makeProps({searchText: 'out'})
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.find(TextInput).prop('onChange')(null, 'text')
    expect(props.updateSearchText.getCall(0).args).to.deep.equal(['text'])
  })

  it('initiates search on open', () => {
    const props = makeProps({
      searchText: 'foo',
      isOpen: false
    })
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.setProps({ isOpen: true })
    expect(props.updateSearchText).to.be.called
  })

  it('aligns when confirm alignment button is clicked', () => {
    const props = makeProps({
      saveOutcomePickerAlignments: sinon.stub().resolves()
    })
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.find('Button').last().prop('onClick')()
    expect(props.saveOutcomePickerAlignments.callCount).to.be.greaterThan(0)
    expect(props.saveOutcomePickerAlignments.calledWith(props.onUpdate, false)).to.equal(true)
  })

  it('calls showAlert when confirm alignment button is clicked', () => {
    const props = makeProps({
      saveOutcomePickerAlignments: sinon.stub().resolves(),
      showAlert: sinon.stub().resolves()
    })
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.find('Button').last().prop('onClick')()
    expect(props.saveOutcomePickerAlignments).to.be.called
  })

  it('syncs selected and aligned outcomes on open', () => {
    const props = makeProps({
      isOpen: false
    })
    wrapper = mount(<OutcomeTray {...props} />)
    wrapper.setProps({ isOpen: true })
    expect(props.setInitialSelectedOutcomes).to.be.called
  })
})
