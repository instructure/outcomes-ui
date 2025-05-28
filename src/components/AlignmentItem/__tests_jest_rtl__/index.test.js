import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import AlignmentItem from '../index'
import {OUTCOME_1} from '../../../test/mockOutcomesData'

expect.extend(toHaveNoViolations)

describe('AlignmentItem', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        outcome: OUTCOME_1,
        removeAlignment: jest.fn(),
        canManageOutcomes: true,
        isTray: false,
        shouldFocus: false,
        isOutcomeSelected: jest.fn(),
        selectOutcomeIds: jest.fn(),
        deselectOutcomeIds: jest.fn(),
      },
      props
    )
  }

  it('renders title', () => {
    render(<AlignmentItem {...makeProps()} />)
    expect(screen.getByText(OUTCOME_1.title)).toBeInTheDocument()
  })

  it('renders the friendly name if user cannot manage outcomes', () => {
    render(<AlignmentItem {...makeProps({canManageOutcomes: false})} />)
    expect(screen.getByText(OUTCOME_1.label)).toBeInTheDocument()
  })

  it('includes an OutcomeDescription', () => {
    render(<AlignmentItem {...makeProps()} />)
    expect(screen.getByText(OUTCOME_1.description)).toBeInTheDocument()
  })

  it('includes a trash icon and delete button if in the alignment list', () => {
    render(<AlignmentItem {...makeProps()} />)
    const removeButton = screen.getByRole('button', {name: /remove/i})
    expect(removeButton).toBeInTheDocument()
    const toggleButton = screen.getByRole('button', {name: /Expand/i})
    expect(toggleButton).toBeInTheDocument()
  })

  it('does not include a trash icon and delete button if in the outcome tray', () => {
    render(<AlignmentItem {...makeProps({isTray: true})} />)
    const removeButton = screen.queryByRole('button', {name: /remove/i})
    expect(removeButton).not.toBeInTheDocument()
    const toggleButton = screen.getByRole('button', {name: /Expand/i})
    expect(toggleButton).toBeInTheDocument()
  })

  it('does not include a trash icon and delete button when canManageOutcomes is false', () => {
    render(<AlignmentItem {...makeProps({canManageOutcomes: false})} />)
    const removeButton = screen.queryByRole('button', {name: /remove/i})
    expect(removeButton).not.toBeInTheDocument()
    const toggleButton = screen.getByRole('button', {name: /Expand/i})
    expect(toggleButton).toBeInTheDocument()
  })

  it('calls removeAlignment when the trash icon is clicked', () => {
    const props = makeProps()
    render(<AlignmentItem {...props} />)
    const removeButton = screen.getByRole('button', {name: /remove/i})
    fireEvent.click(removeButton)
    expect(props.removeAlignment).toHaveBeenCalled()
  })

  it('includes a checkbox if in the outcome tray', () => {
    render(<AlignmentItem {...makeProps({isTray: true})} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('does not include a checkbox if in the alignment list', () => {
    render(<AlignmentItem {...makeProps()} />)
    const checkbox = screen.queryByRole('checkbox')
    expect(checkbox).not.toBeInTheDocument()
  })

  it('handles click on checkbox', () => {
    const props = makeProps({isTray: true})
    props.isOutcomeSelected.mockReturnValue(false)
    render(<AlignmentItem {...props} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(props.isOutcomeSelected).toHaveBeenCalled()
  })

  it('selects the checkbox when isOutcomeSelected', () => {
    const props = makeProps({isTray: true})
    props.isOutcomeSelected.mockReturnValue(true)
    render(<AlignmentItem {...props} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('does not select the checkbox when not isOutcomeSelected', () => {
    const props = makeProps({isTray: true})
    props.isOutcomeSelected.mockReturnValue(false)
    render(<AlignmentItem {...props} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('calls selectOutcomeIds when unselected and user clicks', () => {
    const props = makeProps({isTray: true})
    props.isOutcomeSelected.mockReturnValue(false)
    render(<AlignmentItem {...props} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(props.selectOutcomeIds).toHaveBeenCalledWith([OUTCOME_1.id])
  })

  it('calls deselectOutcomeIds when selected and user clicks', () => {
    const props = makeProps({isTray: true})
    props.isOutcomeSelected.mockReturnValue(true)
    render(<AlignmentItem {...props} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(props.deselectOutcomeIds).toHaveBeenCalledWith([OUTCOME_1.id])
  })

  it('expands and collapses the outcome details when toggle is clicked', () => {
    render(<AlignmentItem {...makeProps()} />)
    const toggleButton = screen.getByRole('button', {name: /Expand/i})
    fireEvent.click(toggleButton)
    expect(screen.getByText(OUTCOME_1.description)).toBeInTheDocument()
    fireEvent.click(toggleButton)
    expect(screen.getByText(OUTCOME_1.description)).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<AlignmentItem {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
