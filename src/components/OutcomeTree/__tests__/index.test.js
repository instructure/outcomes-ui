import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeTree from '../index'
import styles from '../styles.css'
import checkA11y from '../../../test/checkA11y'

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
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeBrowser')).to.have.length(1)
    expect(wrapper.find('OutcomeBrowser').prop('collections')).to.deep.equal(props.collections)
    expect(wrapper.find('OutcomeBrowser').prop('rootOutcomeIds')).to.deep.equal(props.rootOutcomeIds)
    expect(wrapper.find('OutcomeBrowser').prop('expandedIds')).to.deep.equal(props.expandedIds)
  })

  it('wraps the browser with the proper CSS styling', () => {
    const wrapper = shallow(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeTree}`).exists()).to.equal(true)
  })

  it('passes correct params to OutcomeSelectionList component', () => {
    const wrapper = shallow(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeSelectionList').prop('outcomes')).to.deep.equal(nonGroups)
  })

  it('passes correct params to OutcomeFolderList component', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('OutcomeFolderList').prop('outcomes')).to.deep.equal(groups)
    expect(wrapper.find('OutcomeFolderList').prop('activeCollectionId')).to.deep.equal(props.activeCollection.id)
  })

  it('passes correct params to the Text components', () => {
    const wrapper = shallow(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    const texts = wrapper.find('Text')
    const header = wrapper.find('Heading')
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
    const wrapper = shallow(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeDescription}`).exists()).to.equal(true)
  })

  it('shows the proper billboard when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(1)
    expect(wrapper.find('Billboard').prop('heading')).to.equal('Align Outcomes')
  })

  it('shows the proper billboard when there is no active collection id', () => {
    const props = makeProps()
    delete props.activeCollection.id
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Billboard')).to.have.length(1)
    expect(wrapper.find('Billboard').prop('heading')).to.equal('Align Outcomes')
  })

  it('does not set the CSS description styling when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeDescription}`).exists()).to.equal(false)
  })

  it('sets the CSS content styling', () => {
    const props = makeProps({activeCollection: {}})
    const wrapper = shallow(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.outcomeContent}`).exists()).to.equal(true)
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
    wrapper.setProps({...makeProps({activeCollection: {id: '101'}})})
    expect(wrapper.getDOMNode().contains(document.activeElement))
  })
})
