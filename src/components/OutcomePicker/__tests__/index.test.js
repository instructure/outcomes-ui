import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomePicker from '../index'
import OutcomeViewModal from '../../OutcomeViewModal'
import OutcomeTree from '../../OutcomeTree'
import checkA11y from '../../../test/checkA11y'
import { TextInput } from '@instructure/ui-text-input'

describe('OutcomePicker', () => {
  function makeProps (props = {}) {
    return Object.assign({
      focusedOutcome: null,
      selectedOutcomes: [{ id: '2'}, { id: '3' }],
      hasOutcomes: true,
      isOutcomeSelected: sinon.stub().returns(false),
      deselectOutcomeIds: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      setActiveCollection: sinon.spy(),
      setSearchLoading: sinon.spy(),
      setSearchEntries: sinon.spy(),
      updateSearchText: sinon.spy(),
      updateSearchPage: sinon.spy(),
      searchText: '',
      searchPage: 1,
      searchTotal: 0,
      searchEntries: [],
      treeView: OutcomeTree,
      scope: 'scopeForTest',
      artifactTypeName: '',
      isSearchLoading: false,
    }, props)
  }

  it('passes correct params to OutcomeTags component', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeTags').prop('outcomes')).to.deep.equal([{ id: '2'}, { id: '3' }])
  })

  it('has a screen reader content for selected outcomes', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('ScreenReaderContent')).to.have.length(1)
  })

  it('shows an outcome when focused', () => {
    const focusedOutcome = { id: 'TEST-1', guid: 'GUID', label: 'Test outcome', title: 'Testing' }
    const wrapper = shallow(<OutcomePicker {...makeProps({ focusedOutcome })} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeViewModal)).to.have.length(1)
  })

  it('calls setFocusedOutcome when closeAlignment is called', () => {
    const focusedOutcome = { id: 'TEST-1', guid: 'GUID', label: 'Test outcome', title: 'Testing' }
    const props = makeProps({ focusedOutcome })
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    wrapper.find(OutcomeViewModal).prop('closeAlignment')()
    expect(props.setFocusedOutcome.calledOnce).to.be.true
  })

  it('shows the NoResults billboard when there are no outcomes present', () => {
    const props = makeProps({hasOutcomes: false})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('NoResults')).to.have.length(1)
  })

  it('shows NoResults billboard when there are no outcomes present and single shared context', () => {
    const props = makeProps({hasOutcomes: false, sharedContexts: [{uuid:'uuid', name:'name'}]})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('NoResults')).to.have.length(1)
  })

  it('does not display billboard when there are no outcomes present but user can select another context', () => {
    const props = makeProps({
      hasOutcomes: false,
      sharedContexts: [
        {uuid:'uuid1', name:'name1'},
        {uuid:'uuid2', name:'name2'}
      ]
    })
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(0)
  })

  it('shows the NoResults billboard when there are no outcomes present and single shared context', () => {
    const props = makeProps({hasOutcomes: false, sharedContexts: [{uuid:'uuid', name:'name'}]})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('NoResults')).to.have.length(1)
  })

  it('does not display billboard when there are no outcomes present but user can select another context', () => {
    const props = makeProps({
      hasOutcomes: false,
      sharedContexts: [
        {uuid:'uuid1', name:'name1'},
        {uuid:'uuid2', name:'name2'}
      ]
    })
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(0)
  })

  it('renders search bar', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('SearchInput')).to.have.length(1)
  })

  it('renders OutcomeTree when no search text is present', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    const tree = wrapper.find('OutcomeTree')
    expect(tree).to.have.length(1)
    expect(tree.prop('scope')).to.equal(props.scope)
  })

  it('shows only search results when searchText is present', () => {
    const props = makeProps({searchText: 'out'})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('SearchResults')).to.have.length(1)
    expect(wrapper.find('OutcomeTree')).to.have.length(0)
  })

  it('resets focus on update', () => {
    const wrapper = mount(<OutcomePicker {...makeProps()} />)
    wrapper.setProps({...makeProps({activeCollection: {id: '101'}})})
    expect(wrapper.getDOMNode().contains(document.activeElement))
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomePicker {...makeProps()} />)
  })

  it('correctly calls updateSearchText when search text is changed', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomePicker {...props} />)
    const onChange = wrapper.find(TextInput).prop('onChange')
    onChange('', 'abc')
    expect(props.updateSearchText).to.be.called.once
    expect(props.updateSearchText).to.be.calledWith('abc')
  })
})
