import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeSelectionList from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeSelectionList', () => {
  function selectedIds(ids) {
    const isOutcomeSelected = jest.fn()
    isOutcomeSelected.mockReturnValue(false)
    ids.forEach(id => {
      isOutcomeSelected.mockImplementation(outcomeId => outcomeId === id || ids.includes(outcomeId))
    })
    return isOutcomeSelected
  }

  const outcomes = [
    {id: '1', title: 'Title1', description: 'Description for Title1'},
    {id: '2', title: 'Title2', description: 'Description for Title2'},
    {id: '3', title: 'Title3', description: 'Description for Title3'},
  ]

  function makeProps(props = {}) {
    return Object.assign(
      {
        outcomes,
        setFocusedOutcome: jest.fn(),
        isOutcomeSelected: selectedIds([]),
        selectOutcomeIds: jest.fn(),
        deselectOutcomeIds: jest.fn(),
      },
      props
    )
  }

  it('renders a checkbox for each outcome', () => {
    render(<OutcomeSelectionList {...makeProps()} />)
    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByText('Title2')).toBeInTheDocument()
    expect(screen.getByText('Title3')).toBeInTheDocument()
  })

  it('passes the right args to each checkbox', () => {
    render(<OutcomeSelectionList {...makeProps()} />)
    expect(screen.getByText('Title1')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', {name: 'Title1'})).toHaveAttribute('id', 'outcome-select-1')
    expect(screen.getByText('Description for Title1')).toBeInTheDocument()
  })

  it('renders a select all checkbox', () => {
    render(<OutcomeSelectionList {...makeProps()} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /select all/i})
    expect(selectAllCheckbox).toBeInTheDocument()
    expect(selectAllCheckbox).toHaveAttribute('id', 'outcome-select-all')
  })

  it('renders select all as unchecked when no outcomes selected', () => {
    render(<OutcomeSelectionList {...makeProps()} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /select all/i})
    expect(selectAllCheckbox).not.toBeChecked()
  })

  it('renders select all as unchecked when not all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /select all/i})
    expect(selectAllCheckbox).not.toBeChecked()
  })

  it('renders select all as checked when all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /select all/i})
    expect(selectAllCheckbox).toBeChecked()
  })

  it('renders select all checkbox as "Select all" when not all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    expect(screen.getByText('Select all')).toBeInTheDocument()
  })

  it('renders select all checkbox as "Deselect all" when all outcomes selected', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    expect(screen.getByText('Deselect all')).toBeInTheDocument()
  })

  it('calls select function on all outcomes when select all is unchecked and clicked', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /select all/i})
    fireEvent.click(selectAllCheckbox)
    expect(props.selectOutcomeIds).toHaveBeenCalledWith(['1', '2', '3'])
  })

  it('calls unselect function on all outcomes when select all is checked and clicked', () => {
    const props = makeProps({
      isOutcomeSelected: selectedIds(['1', '2', '3']),
    })
    render(<OutcomeSelectionList {...props} />)
    const selectAllCheckbox = screen.getByRole('checkbox', {name: /deselect all/i})
    fireEvent.click(selectAllCheckbox)
    expect(props.deselectOutcomeIds).toHaveBeenCalledWith(['1', '2', '3'])
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeSelectionList {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
