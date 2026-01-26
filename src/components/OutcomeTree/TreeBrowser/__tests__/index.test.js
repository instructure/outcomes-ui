import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import TreeBrowser from '../index'

expect.extend(toHaveNoViolations)

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
      toggleExpandedIds: jest.fn(),
      items: {},
      rootOutcomeIds: [],
      setActiveCollection: jest.fn()
    }, props)
  }

  function collectionsWithRoot (rootIds, collections = null) {
    const cols = collections || rootIds
    return Object.assign(makeProps().collections, {
      root: {id: 'root', name: 'Home', collections: cols, child_ids: rootIds}
    })
  }

  it('renders a TreeBrowser component', () => {
    render(<TreeBrowser {...makeProps()} />)
    expect(screen.getByText('Collectiony Collectionface')).toBeInTheDocument()
  })

  it('does not require a set of rootOutcomeIds', () => {
    render(<TreeBrowser {...makeProps()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('does not render a Home directory if only existing root is a collection', () => {
    render(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: [1],
          collections: collectionsWithRoot([1])
        })}
      />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].textContent).toEqual('Collectiony Collectionface')
  })

  it('renders a Home directory if only existing root is not a collection', () => {
    const rootIds = ['4']
    render(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: rootIds,
          collections: collectionsWithRoot(rootIds, [])
        })}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].textContent).toEqual('Home')
  })

  it('does not render Home level if all roots are collections', () => {
    const rootIds = ['1', '2']
    render(
      <TreeBrowser
        {...makeProps({
          rootOutcomeIds: rootIds,
          collections: collectionsWithRoot(rootIds)
        })}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('passes children of root collections', () => {
    const rootIds = ['1', '2']
    render(
      <TreeBrowser {...makeProps({
        rootOutcomeIds: rootIds,
        collections: collectionsWithRoot(rootIds),
        expandedIds: ['1']
      })}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
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
    render(
      <TreeBrowser {...makeProps({
        rootOutcomeIds: rootIds,
        collections: collections,
        expandedIds: ['2', '3']
      })}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('does not render if collections is empty', () => {
    const props = makeProps({ collections: {} })
    render(<TreeBrowser {...props} />)
    expect(screen.getByText('There are no outcomes')).toBeInTheDocument()
  })

  it('sets the active collection and when clicked', () => {
    const setActiveCollection = jest.fn()
    const props = makeProps({ setActiveCollection })
    render(<TreeBrowser {...props} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(props.setActiveCollection).toHaveBeenCalled()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<TreeBrowser {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
