import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomePicker from '../index'
import OutcomeTree from '../../OutcomeTree'
import {Provider} from 'react-redux'
import createMockStore from '../../../test/createMockStore_jest_rtl'
import {fromJS} from 'immutable'

expect.extend(toHaveNoViolations)

describe('OutcomePicker', () => {
  function makeProps(props = {}, defaultOutcomeTreeProps = {}) {
    const outcomeTreeProps = Object.assign(
      {
        collections: {},
        rootOutcomeIds: [],
        getOutcomeSummary: jest.fn(),
        setActiveCollection: jest.fn(),
        expandedIds: [],
        toggleExpandedIds: jest.fn(),
        setFocusedOutcome: jest.fn(),
        isOutcomeSelected: jest.fn().mockReturnValue(false),
        selectOutcomeIds: jest.fn(),
        deselectOutcomeIds: jest.fn(),
        changeSelectedLaunchContext: jest.fn(),
        selectedLaunchContext: {uuid: 'uuid', name: 'name'},
      },
      defaultOutcomeTreeProps
    )

    return Object.assign(
      {
        focusedOutcome: null,
        selectedOutcomes: [
          {id: '2', title: 'Outcome 2', description: 'Description for Outcome 2'},
          {id: '3', title: 'Outcome 3', description: 'Description for Outcome 3'},
        ],
        hasOutcomes: true,
        setSearchLoading: jest.fn(),
        setSearchEntries: jest.fn(),
        updateSearchText: jest.fn(),
        updateSearchPage: jest.fn(),
        searchText: '',
        searchPage: 1,
        searchTotal: 0,
        searchEntries: [],
        treeView: () => <OutcomeTree {...outcomeTreeProps} />,
        scope: 'scopeForTest',
        artifactTypeName: '',
        isSearchLoading: false,
        ...outcomeTreeProps,
      },
      props
    )
  }

  it('renders selected outcomes', () => {
    render(<OutcomePicker {...makeProps()} />)
    expect(screen.getByText('Outcome 2')).toBeInTheDocument()
    expect(screen.getByText('Outcome 3')).toBeInTheDocument()
  })

  it('has screen reader content for selected outcomes', () => {
    render(<OutcomePicker {...makeProps()} />)
    expect(screen.getByText('Selected outcomes:')).toBeInTheDocument()
  })

  it('shows outcome view modal when an outcome is focused', () => {
    const focusedOutcome = {
      id: 'TEST-1',
      guid: 'GUID',
      label: 'Test outcome',
      title: 'Testing',
      description: 'This is a test outcome',
    }
    const store = createMockStore(fromJS({}))
    render(
      <Provider store={store}>
        <OutcomePicker {...makeProps({focusedOutcome})} />
      </Provider>
    )
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('shows NoResults when there are no outcomes', () => {
    render(<OutcomePicker {...makeProps({hasOutcomes: false})} />)
    expect(screen.getByText(/No outcomes/i)).toBeInTheDocument()
  })

  it('shows NoResults when there are no outcomes and a single shared context', () => {
    render(
      <OutcomePicker
        {...makeProps({
          hasOutcomes: false,
          launchContexts: [{uuid: 'uuid', name: 'name'}],
        })}
      />
    )
    expect(screen.getByText(/No outcomes/i)).toBeInTheDocument()
  })

  it('renders OutcomePicker when there are no outcomes and multiple contexts', () => {
    render(
      <OutcomePicker
        {...makeProps({
          hasOutcomes: false,
          launchContexts: [
            {uuid: 'uuid1', name: 'name1'},
            {uuid: 'uuid2', name: 'name2'},
          ],
        })}
      />
    )
    expect(screen.getByTestId('outcomePicker__container')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<OutcomePicker {...makeProps()} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('renders OutcomeTree when no search text is present', () => {
    const {container} = render(<OutcomePicker {...makeProps()} />)
    expect(container.querySelector('[data-automation="outcomePicker__outcomeTree"]')).toBeTruthy()
  })

  it('shows search results when searchText is present', () => {
    const {container} = render(<OutcomePicker {...makeProps({searchText: 'out'})} />)
    expect(container.querySelector('[data-automation="searchResults__resultsCount"]')).toBeTruthy()
    expect(container.querySelector('[data-automation="outcomePicker__outcomeTree"]')).toBeFalsy()
  })

  it('calls updateSearchText when search input changes', () => {
    const updateSearchText = jest.fn()
    render(<OutcomePicker {...makeProps({updateSearchText})} />)

    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, {target: {value: 'abc'}})

    expect(updateSearchText).toHaveBeenCalledWith('abc')
  })

  it('clears search when clear button is clicked', () => {
    const updateSearchText = jest.fn()
    render(
      <OutcomePicker
        {...makeProps({
          searchText: 'test',
          updateSearchText,
        })}
      />
    )

    const clearButton = screen.getByRole('button', {name: /clear/i})
    fireEvent.click(clearButton)

    expect(updateSearchText).toHaveBeenCalledWith('')
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomePicker {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
