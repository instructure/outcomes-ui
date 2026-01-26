import { expect, jest } from '@jest/globals'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import SearchResults from '../index'
import { OUTCOME_1, OUTCOME_2 } from '../../../test/mockOutcomesData'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

describe('SearchResults', () => {
  function makeProps (props = {}) {
    return Object.assign({
      searchText: 'foo',
      searchPage: 1,
      searchTotal: 99,
      searchOutcomes: jest.fn(),
      setSearchLoading: jest.fn(),
      setSearchEntries: jest.fn(),
      updateSearchPage: jest.fn(),
      isSearchLoading: true,
      searchEntries: [],
      setActiveCollection: jest.fn(),
      toggleExpandedIds: jest.fn(),
      setFocusedOutcome: jest.fn(),
      isOutcomeSelected: jest.fn(),
      selectOutcomeIds: jest.fn(),
      deselectOutcomeIds: jest.fn(),
      screenreaderNotification: jest.fn()
    }, props)
  }

  it('renders Spinner when loading', () => {
    render(<SearchResults {...makeProps()} />)
    expect(screen.getByText('Loading search results')).toBeInTheDocument()
  })

  it('filters out null outcomes if the outcome cannot be found', () => {
    const props = makeProps()
    props.isSearchLoading = false
    props.searchEntries = [OUTCOME_1, null, OUTCOME_2]

    const { container } = render(<SearchResults {...props} />)
    const alignmentItems = container.querySelectorAll('[data-testid="alignment-item"]')

    expect(alignmentItems.length).toBe(2)
    // We can't directly test component props with RTL - we need to test what the user sees
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('B2')).toBeInTheDocument()
  })

  it('passes correct params to AlignmentItem components', () => {
    const props = makeProps()
    props.isSearchLoading = false
    props.searchEntries = [OUTCOME_1]

    const { container } = render(<SearchResults {...props} />)
    const alignmentItems = container.querySelectorAll('[data-testid="alignment-item"]')

    expect(alignmentItems.length).toBe(1)
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('tA1')).toBeInTheDocument()
  })

  describe('returns the correct result count', () => {
    describe('with zero results', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 0, isSearchLoading: false})
        render(<SearchResults {...props} />)
        expect(screen.getByText('The search returned no results')).toBeInTheDocument()
      })
    })

    describe('with one result', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 1, isSearchLoading: false })
        render(<SearchResults {...props} />)
        expect(screen.getByText('1 result')).toBeInTheDocument()
      })
    })

    describe('with more than one result', () => {
      it('returns a properly formatted string', () => {
        const props = makeProps({ searchTotal: 2, isSearchLoading: false })
        render(<SearchResults {...props} />)
        expect(screen.getByText('2 results')).toBeInTheDocument()
      })
    })
  })

  describe('pagination', () => {
    const searchEntries = [OUTCOME_1, OUTCOME_2]

    it('does not include pagination for 0 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 0, isSearchLoading: false })
      render(<SearchResults {...props} />)
      expect(screen.queryByText('Next Page')).not.toBeInTheDocument()
    })

    it('does not include pagination for < 10 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 0, isSearchLoading: false })
      render(<SearchResults {...props} />)
      expect(screen.queryByText('Next Page')).not.toBeInTheDocument()
    })

    it('does include pagination for > 10 results', () => {
      const props = makeProps({ searchEntries, searchTotal: 999, isSearchLoading: false })
      render(<SearchResults {...props} />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('shows the current page', () => {
      const props = makeProps({ searchEntries, searchPage: 25, searchTotal: 999, isSearchLoading: false })
      render(<SearchResults {...props} />)
      expect(screen.queryByText('25')).toBeInTheDocument()
    })

    it('updates the current page when pagination button is clicked', () => {
      const props = makeProps({ searchEntries, searchTotal: 999, isSearchLoading: false })
      render(<SearchResults {...props} />)
      const pageTwoButton = screen.getByText('2')
      fireEvent.click(pageTwoButton)
      expect(props.updateSearchPage).toHaveBeenCalledWith(2)
    })
  })

  describe('screenreaderNotification', () => {
    it('calls the screenreaderNotification when the search loading is complete', () => {
      const props = makeProps({ isSearchLoading: true})
      const { rerender } = render(<SearchResults {...props} />)
      expect(props.screenreaderNotification).not.toHaveBeenCalled()
      // Rerender with new props
      rerender(<SearchResults {...{...props, isSearchLoading: false}} />)
      expect(props.screenreaderNotification).toHaveBeenCalled()
    })
  })

  it('meets a11y standards', async () => {
    const { container } = render(<SearchResults {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
