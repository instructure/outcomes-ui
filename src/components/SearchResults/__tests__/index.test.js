import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import SearchResults from '../index'
import checkA11y from '../../../test/checkA11y'

describe('SearchResults', () => {
  const folderIds = ['1']
  const leafIds = ['2']

  function makeProps (props = {}) {
    const isOutcomeGroup = sinon.stub()
    folderIds.forEach((id) => isOutcomeGroup.withArgs(id).returns(true))
    leafIds.forEach((id) => isOutcomeGroup.withArgs(id).returns(false))

    const getOutcome = sinon.stub()
    getOutcome.withArgs('1').returns({ id: '1', label: 'foo', title: 'bar' })
    getOutcome.withArgs('2').returns({ id: '2', label: 'abc', title: '123' })

    return Object.assign({
      searchText: 'foo',
      searchPage: 1,
      searchTotal: 99,
      searchOutcomes: sinon.spy(),
      setSearchLoading: sinon.spy(),
      setSearchEntries: sinon.spy(),
      updateSearchPage: sinon.stub(),
      isSearchLoading: true,
      searchEntries: [],
      getOutcome: getOutcome,
      getOutcomeSummary: sinon.spy(),
      setActiveCollection: sinon.spy(),
      toggleExpandedIds: sinon.stub(),
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: sinon.spy(),
      isOutcomeGroup: isOutcomeGroup,
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy(),
      screenreaderNotification: sinon.stub()
    }, props)
  }

  it('renders Spinner when loading', () => {
    const wrapper = shallow(<SearchResults {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Spinner')).to.have.length(1)
  })

  it('passes correct params to OutcomeFolder components', () => {
    const props = makeProps()
    props.isSearchLoading = false
    props.searchEntries = [{ id: '1' }]
    const wrapper = shallow(<SearchResults {...props} />, {disableLifecycleMethods: true})
    const folder = wrapper.find('OutcomeFolder')
    const checkbox = wrapper.find('OutcomeCheckbox')

    expect(folder).to.have.length(1)
    expect(checkbox).to.have.length(0)
    expect(folder.prop('outcome')).to.eql({ id: '1', label: 'foo', title: 'bar' })
  })

  it('passes correct params to OutcomeCheckbox components', () => {
    const props = makeProps()
    props.isSearchLoading = false
    props.searchEntries = [{ id: '2' }]
    const wrapper = shallow(<SearchResults {...props} />, {disableLifecycleMethods: true})
    const folder = wrapper.find('OutcomeFolder')
    const checkbox = wrapper.find('OutcomeCheckbox')

    expect(folder).to.have.length(0)
    expect(checkbox).to.have.length(1)
    expect(checkbox.prop('outcome')).to.eql({ id: '2', label: 'abc', title: '123' })
  })

  describe('returns the correct result count', () => {
    describe('with zero results', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 0, isSearchLoading: false})
        const wrapper = shallow(<SearchResults {...props} />, {disableLifecycleMethods: true})
        expect(wrapper.find('Text').prop('children')).to.equal('The search returned no results')
      })
    })

    describe('with one result', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 1, isSearchLoading: false })
        const wrapper = shallow(<SearchResults {...props} />, {disableLifecycleMethods: true})
        expect(wrapper.find('Text').prop('children')).to.equal('1 result')
      })
    })

    describe('with more than one result', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 2, isSearchLoading: false })
        const wrapper = shallow(<SearchResults {...props} />, {disableLifecycleMethods: true})
        expect(wrapper.find('Text').prop('children')).to.equal('2 results')
      })
    })
  })

  describe('pagination', () => {
    const searchEntries = [{ id: '1' }, { id: '2' }]

    it('does not include pagination for 0 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 0, isSearchLoading: false })
      const wrapper = mount(<SearchResults {...props} />, {disableLifecycleMethods: true})
      const nextPageButton = wrapper.find('button').findWhere((z) => z.text() == 'Next Page')
      expect(nextPageButton).to.have.length(0)
    })

    it('does not include pagination for < 10 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 0, isSearchLoading: false })
      const wrapper = mount(<SearchResults {...props} />, {disableLifecycleMethods: true})
      const nextPageButton = wrapper.find('button').findWhere((z) => z.text() == 'Next Page')
      expect(nextPageButton).to.have.length(0)
    })

    it('does include pagination for > 10 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 999, isSearchLoading: false })
      const wrapper = mount(<SearchResults {...props} />, {disableLifecycleMethods: true})
      const nextPageButton = wrapper.find('button').findWhere((z) => z.text() == 'Next Page')
      expect(nextPageButton).not.to.have.length(0)
    })

    it('shows the current page', () => {
      const props = makeProps({ searchEntries, searchPage: 25, searchTotal: 999, isSearchLoading: false })
      const wrapper = mount(<SearchResults {...props} />, {disableLifecycleMethods: true})
      const currentPageButton = wrapper.find('button').findWhere((z) => z.text() == '25')
      expect(currentPageButton).not.to.have.length(0)
    })

    it('updates the current page when pagination button is clicked', () => {
      const props = makeProps({ searchEntries, isSearchLoading: false })
      const wrapper = mount(<SearchResults {...props} />, {disableLifecycleMethods: true})
      const pageTwoButton = wrapper.find('button').findWhere((z) => z.text() == '2')
      pageTwoButton.first().simulate('click')
      expect(props.updateSearchPage).to.have.been.calledWith(2)
    })
  })

  describe('screenreaderNotification', () => {
    it('calls the screenreaderNotification when the search loading is complete', () => {
      const props = makeProps({ isSearchLoading: true})
      const wrapper = mount(<SearchResults {...props} />)
      expect(props.screenreaderNotification).not.to.have.been.called
      wrapper.setProps({isSearchLoading: false})
      expect(props.screenreaderNotification).to.have.been.called
    })
  })

  it('meets a11y standards', () => {
    return checkA11y(<SearchResults {...makeProps()} />)
  })
})
