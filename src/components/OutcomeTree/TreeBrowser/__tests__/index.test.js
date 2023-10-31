import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import TreeBrowser from '../index'
import checkA11y from '../../../../test/checkA11y'

describe('TreeBrowser', () => {
  function makeProps (props = {}) {
    return Object.assign({
      collections: {
        1: {
          id: '1',
          name: 'Collectiony Collectionface',
          collections: ['3']
        },
        2: {
          id: '2',
          name: 'Collection 2 Electric Boogaloo'
        },
        3: {
          id: '3',
          name: 'Collection Trifection'
        }
      },
      expandedIds: [],
      toggleExpandedIds: sinon.spy(),
      items: {},
      rootOutcomeIds: [],
      setActiveCollection: sinon.spy()
    }, props)
  }

  function collectionsWithRoot (rootIds, collections = null) {
    const cols = collections || rootIds
    return Object.assign(makeProps().collections, {
      root: {id: 'root', name: 'Home', collections: cols, child_ids: rootIds}
    })
  }

  it('renders a TreeBrowser component', () => {
    const wrapper = mount(<TreeBrowser {...makeProps()} />)
    expect(wrapper.find(TreeBrowser)).to.have.length(1)
  })

  it('does not require a set of rootOutcomeIds', () => {
    const wrapper = mount(<TreeBrowser {...makeProps()} />)
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(6)
  })

  it('does not render a Home directory if only existing root is a collection', () => {
    const wrapper = mount(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: [1],
          collections: collectionsWithRoot([1])
        })}
      />
    )
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(4)
    expect(wrapper.find('TreeButton').at(0).text()).to.include('Collectiony Collectionface')
  })

  it('renders a Home directory if only existing root is not a collection', () => {
    const rootIds = ['4']
    const wrapper = mount(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: rootIds,
          collections: collectionsWithRoot(rootIds, [])
        })}
      />
    )
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(2)
    expect(wrapper.find('TreeButton').at(0).text()).to.include('Home')
  })

  it('does not render Home level if all roots are collections', () => {
    const rootIds = ['1', '2']
    const wrapper = mount(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: rootIds,
          collections: collectionsWithRoot(rootIds)
        })}
      />
    )
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(4)
  })

  it('passes children of root collections', () => {
    const rootIds = ['1', '2']
    const wrapper = mount(
      <TreeBrowser {...makeProps({
        rootOutcomeIds: rootIds,
        collections: collectionsWithRoot(rootIds),
        expandedIds: ['1']
      })}
      />
    )
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(6)
  })

  it('can expand non-root collections', () => {
    const collections = {
      1: {
        id: '1',
        name: 'Collectiony Collectionface',
        collections: ['2']
      },
      2: {
        id: '2',
        name: 'Collection 2 Electric Boogaloo',
        collections: ['3']
      },
      3: {
        id: '3',
        name: 'Collection 2 Electric Boogaloo',
        collections: ['4']
      },
      4: {
        id: '4',
        name: 'Collection Trifection'
      },
      root: {id: 'root', name: 'Home', collections: ['1'], child_ids: ['1']}
    }

    const rootIds = ['1']
    const wrapper = mount(
      <TreeBrowser {...makeProps({
        rootOutcomeIds: rootIds,
        collections: collections,
        expandedIds: ['2', '3']
      })}
      />
    )
    // Enzyme finds extra TreeButton components because of the instui decorator on the component
    expect(wrapper.find('TreeButton')).to.have.length(8)
  })

  it('does not render if collections are undefined', () => {
    const props = makeProps({ collections: void 0 })
    const wrapper = mount(<TreeBrowser {...props} />)
    expect(wrapper.find('TreeBrowser')).to.have.length(0)
  })

  it('sets the active collection and when clicked', () => {
    const setActiveCollection = sinon.stub()
    const props = makeProps({ setActiveCollection })
    const wrapper = mount(<TreeBrowser {...props} />)
    wrapper.find('TreeButton').first().simulate('click')
    expect(props.setActiveCollection.calledWith()).to.equal(true)
  })

  it('meets a11y standards', () => {
    return checkA11y(<TreeBrowser {...makeProps()} />)
  })
})
