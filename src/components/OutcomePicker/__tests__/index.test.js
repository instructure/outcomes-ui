import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomePicker from '../index'
import OutcomeViewModal from '../../OutcomeViewModal'
import checkA11y from '../../../test/checkA11y'
import styles from '../styles.css'

describe('OutcomePicker', () => {
  const folderIds = ['2', '3', '6']
  const leafIds = ['4', '5']

  function makeProps (props = {}) {
    const isOutcomeGroup = sinon.stub()
    folderIds.forEach((id) => isOutcomeGroup.withArgs(id).returns(true))
    leafIds.forEach((id) => isOutcomeGroup.withArgs(id).returns(false))

    return Object.assign({
      focusedOutcome: null,
      selectedOutcomeIds: ['2', '3'],
      activeChildrenIds: ['2', '3', '4', '5', '6'],
      rootOutcomeIds: [],
      getOutcome: sinon.stub().returns({ id: '1', label: 'FOO', title: 'bar' }),
      isOutcomeSelected: sinon.stub().returns(false),
      isOutcomeGroup,
      getOutcomeSummary: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      setActiveCollection: sinon.spy(),
      setSearchLoading: sinon.spy(),
      setSearchText: sinon.spy(),
      updateSearchText: sinon.spy(),
      updateSearchPage: sinon.spy(),
      collections: {
        100: { id: '100', name: 'Outcome group' }
      },
      expandedIds: [],
      activeCollection: {
        id: '100',
        header: 'Outcome group',
        summary: '1 outcome',
        description: 'This is the description'
      },
      features: [],
      searchText: '',
      searchPage: 1,
      searchTotal: 0
    }, props)
  }

  it('passes correct params to OutcomeTags component', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeTags').prop('ids')).to.deep.equal(['2', '3'])
  })

  it('passes correct params to OutcomeSelectionList component', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeSelectionList').prop('ids')).to.deep.equal(leafIds)
  })

  it('passes correct params to OutcomeFolderList component', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeFolderList').prop('ids')).to.deep.equal(folderIds)
  })

  it('shows an outcome when focused', () => {
    const focusedOutcome = { id: 'TEST-1', guid: 'GUID', label: 'Test outcome', title: 'Testing' }
    const wrapper = shallow(<OutcomePicker {...makeProps({ focusedOutcome })} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeViewModal)).to.have.length(1)
  })

  it('passes correct params to the Text components', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    const texts = wrapper.find('Text')
    const header = wrapper.find('Heading')
    expect(texts.at(0).render().text()).to.equal('1 outcome')
    expect(texts.at(1).render().text()).to.equal('This is the description')
    expect(header.at(0).render().text()).to.equal('Outcome group')
  })

  it('sanitizes the outcome description', () => {
    const props = makeProps()
    props.activeCollection.description = 'I have <blink>invalid html'
    const wrapper = mount(<OutcomePicker {...props} />)
    expect(wrapper.html()).to.include('</blink>')
  })

  it('sets the CSS styling when there is a description', () => {
    const wrapper = shallow(<OutcomePicker {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeDescription}`).exists()).to.equal(true)
  })

  it('shows the proper billboard when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(1)
    expect(wrapper.find('Billboard').prop('heading')).to.equal('Align Outcomes')
  })

  it('shows the proper billboard when there are no collections present', () => {
    const props = makeProps({collections: void 0})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(1)
    expect(wrapper.find('Billboard').prop('heading')).to.equal('There are no outcomes')
  })

  it('does not set the CSS styling when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeDescription}`).exists()).to.equal(false)
  })

  it('handles missing activeCollection props', () => {
    const props = makeProps()
    delete props.activeCollection
    const wrapper = mount(<OutcomePicker {...props} />)
    const texts = wrapper.find('Text')
    expect(texts.at(0).render().text()).to.equal('')
    // expect(texts.at(1).render().text()).to.equal('')
    // expect(texts.at(2).render().text()).to.equal('')
  })

  it('renders search bar if feature enabled', () => {
    const props = makeProps({features: ['outcomes_search']})
    const wrapper = shallow(<OutcomePicker {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('SearchInput')).to.have.length(1)

  })

  it('shows only search results when searchText is present and feature enabled', () => {
    const props = makeProps({searchText: 'out', features: ['outcomes_search']})
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
    const props = makeProps({features: ['outcomes_search']})
    const wrapper = mount(<OutcomePicker {...props} />)
    const onChange = wrapper.find('TextInput').prop('onChange')
    onChange('', 'abc')
    expect(props.updateSearchText).to.be.called.once
    expect(props.updateSearchText).to.be.calledWith('abc')
  })
})
