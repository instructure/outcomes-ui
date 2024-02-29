import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeTree from '../index'
import styles from '../styles'
import checkA11y from '../../../test/checkA11y'
import OutcomeBrowser from '../TreeBrowser'
import OutcomeSelectionList from '../../OutcomeSelectionList'
import OutcomeFolderList from '../../OutcomeFolderList'
import { Text } from '@instructure/ui-text'
import { Heading } from '@instructure/ui-heading'
import { Billboard } from '@instructure/ui-billboard'
import { findElementsWithStyle } from '../../../util/__tests__/findElementsWithStyle'
import {SimpleSelect} from '@instructure/ui-simple-select'

describe('OutcomeTree', () => {
  const outcomeData = { label: 'FOO', title: 'bar' }
  const groups = [
    {'id': '2', ...outcomeData },
    {'id': '3', ...outcomeData},
    {'id': '6', ...outcomeData}
  ]
  const nonGroups = [
    {'id': '4', ...outcomeData}, {'id': '5', ...outcomeData}
  ]

  function makeProps (props = {}) {
    return Object.assign({
      activeChildren: {
        groups, nonGroups
      },
      rootOutcomeIds: [],
      toggleExpandedIds: sinon.spy(),
      isOutcomeSelected: sinon.stub().returns(false),
      getOutcomeSummary: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      changeSelectedLaunchContext: sinon.spy(),
      deselectOutcomeIds: sinon.spy(),
      setFocusedOutcome: sinon.spy(),
      setActiveCollection: sinon.spy(),
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
    }, props)
  }

  it('passes the correct params to OutcomeBrowser', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeBrowser)).to.have.length(1)
    expect(wrapper.find(OutcomeBrowser).prop('collections')).to.deep.equal(props.collections)
    expect(wrapper.find(OutcomeBrowser).prop('rootOutcomeIds')).to.deep.equal(props.rootOutcomeIds)
    expect(wrapper.find(OutcomeBrowser).prop('expandedIds')).to.deep.equal(props.expandedIds)
  })

  it('wraps the browser with the proper CSS styling', () => {
    const wrapper = mount(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(findElementsWithStyle(wrapper, styles().outcomeTree).exists()).to.equal(true)
  })

  it('passes correct params to OutcomeSelectionList component', () => {
    const wrapper = mount(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeSelectionList).prop('outcomes')).to.deep.equal(nonGroups)
  })

  it('passes correct params to OutcomeFolderList component', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(OutcomeFolderList).prop('outcomes')).to.deep.equal(groups)
    expect(wrapper.find(OutcomeFolderList).prop('activeCollectionId')).to.deep.equal(props.activeCollection.id)
  })

  it('passes correct params to the Text components', () => {
    const wrapper = mount(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    const texts = wrapper.find(Text)
    const header = wrapper.find(Heading)
    expect(texts.at(0).render().text()).to.equal('1 outcome')
    expect(texts.at(1).render().text()).to.equal('This is the description')
    expect(header.at(0).render().text()).to.equal('Outcome group')
  })

  it('sanitizes the outcome description', () => {
    const props = makeProps()
    props.activeCollection.description = 'I have <blink>invalid html'
    const wrapper = mount(<OutcomeTree {...props} />)
    expect(wrapper.html()).to.include('</blink>')
  })

  it('sets the CSS styling when there is a description', () => {
    const wrapper = mount(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('.outcomeTreeOutcomeDescription').exists()).to.equal(true)
  })

  it('shows the proper billboard when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = mount(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Billboard)).to.have.length(1)
    expect(wrapper.find(Billboard).prop('heading')).to.equal('Align Outcomes')
  })

  it('shows the proper billboard when there is no active collection id', () => {
    const props = makeProps()
    delete props.activeCollection.id
    const wrapper = mount(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(Billboard)).to.have.length(1)
    expect(wrapper.find(Billboard).prop('heading')).to.equal('Align Outcomes')
  })

  it('does not set the CSS description styling when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeDescription}`).exists()).to.equal(false)
  })

  it('sets the CSS content styling', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = mount(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(findElementsWithStyle(wrapper, styles().outcomeContent).exists()).to.equal(true)
  })

  it('handles missing activeCollection props', () => {
    const props = makeProps()
    delete props.activeCollection
    const wrapper = mount(<OutcomeTree {...props} />)
    const texts = wrapper.find('Text')
    expect(texts.at(0).render().text()).to.equal('Select all')
  })

  it('meets a11y standards', () => {
    const props = makeProps()
    return checkA11y(<OutcomeTree {...props} />)
  })

  it('resets focus on update', () => {
    const wrapper = mount(<OutcomeTree {...makeProps()} />)

    // It is not very apparent how this test works. At this point, wrapper.getDOMNode()
    // returns the outcome tree with outcome 100 as active (see makeProps()). The next
    // line sets the collection to 101, which cannot be found, so the outcome description
    // title and header is not rendered. This test would be more readable if it was
    // asserting that, because it is not clear what document.activeElement is.

    wrapper.setProps({...makeProps({activeCollection: {id: '101', header: 'Foo'}})})
    expect(wrapper.getDOMNode().contains(document.activeElement))
  })

  it('does not render context selector if missing launchContexts', () => {
    // Make props does not set the launchContexts property
    const props = makeProps()
    const wrapper = mount(<OutcomeTree {...props} />)
    expect(wrapper.find(SimpleSelect)).to.have.length(0)
  })

  it('does not render context selector if only one context', () => {
    // Make props does not set the launchContexts property
    const props = makeProps()
    props.launchContexts = [{uuid: 'foo', name: 'bar'}]
    const wrapper = mount(<OutcomeTree {...props} />)
    expect(wrapper.find(SimpleSelect)).to.have.length(0)
  })

  it('render context selector if more than one context', () => {
    // Make props does not set the launchContexts property
    const props = makeProps({
      launchContexts: [{uuid: 'foo', name: 'bar'}, {uuid: 'fuz', name: 'baz'}],
      selectedLaunchContext: {uuid: 'fuz', name: 'baz'}
    })
    const wrapper = mount(<OutcomeTree {...props} />)
    const contextSelector = wrapper.find(SimpleSelect)
    expect(contextSelector).to.have.length(1)
    expect(contextSelector.prop('value')).to.equal('baz')
  })
})
