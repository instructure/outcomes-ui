import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeCheckbox from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeCheckbox', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        outcome: {
          id: '101',
          label: 'XYZ',
          title: 'The student will make cupcakes',
          description: 'Hello there',
        },
        setFocusedOutcome: jest.fn(),
        isOutcomeSelected: jest.fn(),
        selectOutcomeIds: jest.fn(),
        deselectOutcomeIds: jest.fn(),
      },
      props
    )
  }

  it('renders a checkbox', () => {
    render(<OutcomeCheckbox {...makeProps()} />)
    const checkbox = screen.getByRole('checkbox', {name: /The student will make cupcakes/i})
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute('id', 'outcome-select-101')
  })

  it('renders outcome title in button', () => {
    render(<OutcomeCheckbox {...makeProps()} />)
    const button = screen.getByRole('button', {name: /The student will make cupcakes/i})
    expect(button).toBeInTheDocument()
  })

  it('renders friendly description', () => {
    const props = makeProps({
      outcome: {
        id: '101',
        label: 'XYZ',
        title: 'The student will make cupcakes',
        description: 'Hello there',
        friendly_description: 'This is the Friendly Description',
      },
    })
    render(<OutcomeCheckbox {...props} />)
    expect(screen.getByText('Friendly Description')).toBeInTheDocument()
    expect(screen.getByText('This is the Friendly Description')).toBeInTheDocument()
  })

  it('does not render friendly description', () => {
    render(<OutcomeCheckbox {...makeProps()} />)
    expect(screen.queryByText('Friendly Description')).not.toBeInTheDocument()
  })

  it('renders an OutcomeDescription component', () => {
    render(<OutcomeCheckbox {...makeProps()} />)
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('will focus an outcome when the title is clicked', () => {
    const props = makeProps()
    render(<OutcomeCheckbox {...props} />)

    const button = screen.getByRole('button', {name: /The student will make cupcakes/i})
    fireEvent.click(button)

    expect(props.setFocusedOutcome).toHaveBeenCalledWith(props.outcome)
  })

  it('selects the checkbox when isOutcomeSelected returns true', () => {
    const isOutcomeSelected = jest.fn().mockImplementation(() => true)
    const props = makeProps({isOutcomeSelected})

    render(<OutcomeCheckbox {...props} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('does not select the checkbox when isOutcomeSelected returns false', () => {
    const isOutcomeSelected = jest.fn().mockImplementation(() => false)
    const props = makeProps({isOutcomeSelected})

    render(<OutcomeCheckbox {...props} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('calls selectOutcomeIds when unselected and user clicks', () => {
    const isOutcomeSelected = jest.fn().mockImplementation(() => false)
    const props = makeProps({isOutcomeSelected})

    render(<OutcomeCheckbox {...props} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(props.selectOutcomeIds).toHaveBeenCalledWith(['101'])
  })

  it('calls deselectOutcomeIds when selected and user clicks', () => {
    const isOutcomeSelected = jest.fn().mockImplementation(() => true)
    const props = makeProps({isOutcomeSelected})

    render(<OutcomeCheckbox {...props} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(props.deselectOutcomeIds).toHaveBeenCalledWith(['101'])
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeCheckbox {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
