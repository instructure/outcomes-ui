import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import OutcomeTray from '../index'

expect.extend(toHaveNoViolations)

jest.mock('../OutcomeList', () => {
  // eslint-disable-next-line react/display-name
  return () => <div>OutcomeList</div>
})

jest.mock('../../SearchResults', () => {
  // eslint-disable-next-line react/display-name
  return () => <div>SearchResults</div>
})

describe('OutcomeTray', () => {
  function makeProps (props = {}) {
    return Object.assign({
      searchText: '',
      updateSearchText: jest.fn(),
      updateSearchPage: jest.fn(),
      saveOutcomePickerAlignments: jest.fn(),
      setSearchLoading: jest.fn(),
      setSearchEntries: jest.fn(),
      isSearchLoading: false,
      searchEntries: [],
      getOutcome: jest.fn(),
      getOutcomeSummary: jest.fn(),
      setActiveCollection: jest.fn(),
      toggleExpandedIds: jest.fn(),
      setFocusedOutcome: jest.fn(),
      isOutcomeSelected: jest.fn(),
      isOutcomeGroup: jest.fn(),
      selectOutcomeIds: jest.fn(),
      deselectOutcomeIds: jest.fn(),
      screenreaderNotification: jest.fn(),
      onUpdate: jest.fn(),
      searchTotal: 0,
      searchPage: 0,
      getOutcomesList: jest.fn(),
      outcomes: [],
      isOpen: true,
      isFetching: false,
      scope: 'scopeForTest',
      listPage: 0,
      listTotal: 0,
      resetOutcomePicker: jest.fn(),
      closeOutcomePicker: jest.fn(),
      setInitialSelectedOutcomes: jest.fn(),
      shouldModifyArtifact: false,
      showAlert: jest.fn()
    }, props)
  }

  it('renders a tray', () => {
    render(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getByRole('dialog', { name: 'Align Outcomes' })).toBeInTheDocument()
  })

  it('renders cancel and alignment button', () => {
    render(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getAllByRole('button', {name: 'Cancel'})).toHaveLength(2)
    expect(screen.getByRole('button', {name: 'Confirm Alignments'})).toBeInTheDocument()
  })

  it('renders tray closed by when state is closed', () => {
    const props = makeProps({ isOpen: false })
    render(<OutcomeTray {...props} />, {disableLifecycleMethods: true})
    expect(screen.queryByRole('dialog', { name: 'Align Outcomes' })).not.toBeInTheDocument()
  })

  it('renders tray open when state not closed', () => {
    render(<OutcomeTray {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getByRole('dialog', { name: 'Align Outcomes' })).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeTray {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders icon and list if no search text', () => {
    render(<OutcomeTray {...makeProps()} />)
    expect(document.body.querySelector('[name="IconSearch"]')).toBeInTheDocument()
    expect(screen.getByText('OutcomeList')).toBeInTheDocument()
  })

  it('closes when close button is clicked', () => {
    const props = makeProps()
    render(<OutcomeTray {...props} />)
    fireEvent.click(screen.getAllByRole('button', {name: 'Cancel'})[0])
    expect(props.closeOutcomePicker).toHaveBeenCalledTimes(1)
  })

  it('shows only search results when searchText is present', () => {
    const props = makeProps({searchText: 'foo'})
    render(<OutcomeTray {...props} />, {disableLifecycleMethods: true})
    expect(screen.queryByText('SearchResults')).toBeInTheDocument()
    expect(screen.queryByText('OutcomeList')).not.toBeInTheDocument()
  })

  it('updates search text when new search is entered', () => {
    const props = makeProps({searchText: 'out'})
    render(<OutcomeTray {...props} />)
    expect(props.updateSearchText).toHaveBeenCalledTimes(0)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'text' } })
    expect(props.updateSearchText).toHaveBeenCalledTimes(1)
  })

  it('initiates search on open', () => {
    const props = makeProps({
      searchText: 'foo',
      isOpen: false
    })
    const { rerender } = render(<OutcomeTray {...props} />)
    props.isOpen = true
    rerender(<OutcomeTray {...props} />)
    expect(props.updateSearchText).toHaveBeenCalledTimes(1)
  })

  it('aligns when confirm alignment button is clicked', () => {
    const props = makeProps({
      saveOutcomePickerAlignments: jest.fn().mockResolvedValue(),
    })
    render(<OutcomeTray {...props} />)
    fireEvent.click(screen.getByRole('button', {name: 'Confirm Alignments'}))
    expect(props.saveOutcomePickerAlignments).toHaveBeenCalledWith(props.onUpdate, false)
  })

  it('calls showAlert when confirm alignment button is clicked', () => {
    const props = makeProps({
      saveOutcomePickerAlignments: jest.fn().mockResolvedValue(),
      showAlert: jest.fn().mockResolvedValue(),
    })
    render(<OutcomeTray {...props} />)
    fireEvent.click(screen.getByRole('button', {name: 'Confirm Alignments'}))
    expect(props.saveOutcomePickerAlignments).toHaveBeenCalled()
  })

  it('syncs selected and aligned outcomes on open', () => {
    const props = makeProps({
      isOpen: false
    })
    const { rerender } = render(<OutcomeTray {...props} />)
    props.isOpen = true
    rerender(<OutcomeTray {...props} />)
    expect(props.setInitialSelectedOutcomes).toHaveBeenCalled()
  })
})
