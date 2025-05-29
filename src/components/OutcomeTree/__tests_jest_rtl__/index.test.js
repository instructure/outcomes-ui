import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import OutcomeTree from '../index'

const mockOutcomeTreeStyle = jest.fn()
const mockOutcomeDescriptionStyle = jest.fn()
const mockOutcomeContentStyle = jest.fn()

jest.mock('../styles', () => {
  return () => {
    return {
      get outcomeTree () {
        mockOutcomeTreeStyle()
        return {}
      },
      get outcomeDescription () {
        mockOutcomeDescriptionStyle()
        return {}
      },
      get outcomeContent () {
        mockOutcomeContentStyle()
        return {}
      }
    }
  }
})

jest.mock('../TreeBrowser', () => {
  // eslint-disable-next-line react/display-name
  return (props) => <div>
    OutcomeBrowser
    <div data-testid="browser-collections">{JSON.stringify(props.collections)}</div>
    <div data-testid="browser-rootOutcomeIds">{JSON.stringify(props.rootOutcomeIds)}</div>
    <div data-testid="browser-expandedIds">{JSON.stringify(props.expandedIds)}</div>
  </div>
})

jest.mock('../../OutcomeSelectionList', () => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    props.setFocusedOutcome && props.setFocusedOutcome()
    return <div>
      OutcomeSelectionList
      <div data-testid="selection-list-outcomes">{JSON.stringify(props.outcomes)}</div>
    </div>
  }
})

jest.mock('../../OutcomeFolderList', () => {
  // eslint-disable-next-line react/display-name
  return (props) => <div>
    OutcomeFolderList
    <div data-testid="folder-list-outcomes">{JSON.stringify(props.outcomes)}</div>
    <div data-testid="folder-list-active-collection-id">{props.activeCollectionId}</div>
  </div>
})

jest.mock('@instructure/ui-billboard', () => {
  // eslint-disable-next-line react/display-name
  return {
    Billboard: (props) => <div data-testid="billboard">
      <div data-testid="billboard-message">{props.message}</div>
      <div data-testid="billboard-heading">{props.heading}</div>
    </div>
  }
})

jest.mock('@instructure/ui-simple-select', () => {
  // eslint-disable-next-line react/display-name
  return {
    SimpleSelect: (props) => <div data-testid="simple-select">
      <div data-testid="simple-select-value">{props.value}</div>
    </div>
  }
})

expect.extend(toHaveNoViolations)

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
      toggleExpandedIds: jest.fn(),
      isOutcomeSelected: jest.fn().mockReturnValue(false),
      getOutcomeSummary: jest.fn(),
      selectOutcomeIds: jest.fn(),
      changeSelectedLaunchContext: jest.fn(),
      deselectOutcomeIds: jest.fn(),
      setFocusedOutcome: jest.fn(),
      setActiveCollection: jest.fn(),
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

  beforeEach(() => {
    mockOutcomeTreeStyle.mockClear()
    mockOutcomeDescriptionStyle.mockClear()
    mockOutcomeContentStyle.mockClear()
  })

  it('passes the correct params to OutcomeBrowser', () => {
    const props = makeProps()
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(screen.getByText('OutcomeBrowser')).toBeInTheDocument()
    expect(screen.getByTestId('browser-collections')).toHaveTextContent(JSON.stringify(props.collections))
    expect(screen.getByTestId('browser-rootOutcomeIds')).toHaveTextContent(JSON.stringify(props.rootOutcomeIds))
    expect(screen.getByTestId('browser-expandedIds')).toHaveTextContent(JSON.stringify(props.expandedIds))
  })

  it('wraps the browser with the proper CSS styling', () => {
    expect(mockOutcomeTreeStyle).not.toHaveBeenCalled()
    render(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(mockOutcomeTreeStyle).toHaveBeenCalled()
  })

  it('passes correct params to OutcomeSelectionList component', () => {
    render(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getByTestId('selection-list-outcomes')).toHaveTextContent(JSON.stringify(nonGroups))
  })

  it('passes correct params to OutcomeFolderList component', () => {
    const props = makeProps()
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(screen.getByTestId('folder-list-outcomes')).toHaveTextContent(JSON.stringify(groups))
    expect(screen.getByTestId('folder-list-active-collection-id')).toHaveTextContent(props.activeCollection.id)
  })

  it('passes correct params to the Text components', () => {
    render(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getByText('1 outcome')).toBeInTheDocument()
    expect(screen.getByText('This is the description')).toBeInTheDocument()
    expect(screen.getByText('Outcome group')).toBeInTheDocument()
  })

  it('sanitizes the outcome description', () => {
    const props = makeProps()
    props.activeCollection.description = 'I have <blink>invalid html'
    const { container } = render(<OutcomeTree {...props} />)
    expect(container.innerHTML).toContain('</blink>')
  })

  it('sets the CSS styling when there is a description', () => {
    render(<OutcomeTree {...makeProps()} />, {disableLifecycleMethods: true})
    expect(document.querySelector('.outcomeTreeOutcomeDescription')).toBeInTheDocument()
  })

  it('shows the proper billboard when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    const billboards = screen.getAllByTestId('billboard')
    expect(billboards).toHaveLength(1)
    expect(screen.getByTestId('billboard-heading')).toHaveTextContent('Align Outcomes')
  })

  it('shows the proper billboard when there is no active collection id', () => {
    const props = makeProps()
    delete props.activeCollection.id
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    const billboards = screen.getAllByTestId('billboard')
    expect(billboards).toHaveLength(1)
    expect(screen.getByTestId('billboard-heading')).toHaveTextContent('Align Outcomes')
  })

  it('does not set the CSS description styling when there are no active collection details', () => {
    const props = makeProps({activeCollection: {}})
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(mockOutcomeDescriptionStyle).not.toHaveBeenCalled()
  })

  it('sets the CSS content styling', () => {
    const props = makeProps({activeCollection: {}})
    render(<OutcomeTree {...props} />, {disableLifecycleMethods: true})
    expect(mockOutcomeContentStyle).toHaveBeenCalled()
  })

  it('handles missing activeCollection props', () => {
    const props = makeProps()
    delete props.activeCollection
    render(<OutcomeTree {...props} />)
    expect(screen.getByTestId('billboard-message')).toHaveTextContent('Browse your outcomes using the group folders.')
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeTree {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('resets focus on update', () => {
    const propsA = makeProps()
    const { rerender } = render(<OutcomeTree {...propsA} />)

    // It is not very apparent how this test works. At this point, wrapper.getDOMNode()
    // returns the outcome tree with outcome 100 as active (see makeProps()). The next
    // line sets the collection to 101, which cannot be found, so the outcome description
    // title and header is not rendered. This test would be more readable if it was
    // asserting that, because it is not clear what document.activeElement is.
    expect(propsA.setFocusedOutcome).toHaveBeenCalledTimes(1)
    const propsB = makeProps({activeCollection: {id: '101'}})
    rerender(<OutcomeTree {...propsB} />)
    expect(propsB.setFocusedOutcome).toHaveBeenCalledTimes(1)
  })

  it('does not render context selector if missing launchContexts', () => {
    // Make props does not set the launchContexts property
    const props = makeProps()
    render(<OutcomeTree {...props} />)
    const simpleSelects = screen.queryAllByTestId('simple-select')
    expect(simpleSelects).toHaveLength(0)
  })

  it('does not render context selector if only one context', () => {
    // Make props does not set the launchContexts property
    const props = makeProps()
    props.launchContexts = [{uuid: 'foo', name: 'bar'}]
    render(<OutcomeTree {...props} />)
    const simpleSelects = screen.queryAllByTestId('simple-select')
    expect(simpleSelects).toHaveLength(0)
  })

  it('render context selector if more than one context', () => {
    // Make props does not set the launchContexts property
    const props = makeProps({
      launchContexts: [{uuid: 'foo', name: 'bar'}, {uuid: 'fuz', name: 'baz'}],
      selectedLaunchContext: {uuid: 'fuz', name: 'baz'}
    })
    render(<OutcomeTree {...props} />)
    expect(screen.getByTestId('simple-select-value')).toHaveTextContent('baz')
  })
})
