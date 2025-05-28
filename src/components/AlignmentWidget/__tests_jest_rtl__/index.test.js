import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import AlignmentWidget from '../index'
import {OUTCOME_1, OUTCOME_2, OUTCOME_3} from '../../../test/mockOutcomesData'

expect.extend(toHaveNoViolations)

describe('AlignmentWidget', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        alignedOutcomes: [OUTCOME_1, OUTCOME_2, OUTCOME_3],
        tray: () => <div className="outcomeTray" />,
        scope: 'scopeForTest',
        openOutcomePicker: jest.fn(),
        removeAlignment: jest.fn(),
        onUpdate: jest.fn(),
        screenreaderNotification: jest.fn(),
        canManageOutcomes: true,
      },
      props
    )
  }

  it('renders a button with a11y components', () => {
    const {container} = render(<AlignmentWidget {...makeProps()} />)
    const button = container.querySelector('[data-automation="alignmentWidget__button"]')
    expect(button).toBeInTheDocument()
    expect(screen.getByText('Aligned Outcomes')).toBeInTheDocument()
  })

  it('does not render an alignment button if canManageOutcomes is false', () => {
    const {container} = render(<AlignmentWidget {...makeProps({canManageOutcomes: false})} />)
    const button = container.querySelector('[data-automation="alignmentWidget__button"]')
    expect(button).not.toBeInTheDocument()
  })

  it('does not render header if canManageOutcomes is false and no outcomes are aligned', () => {
    render(<AlignmentWidget {...makeProps({canManageOutcomes: false, alignedOutcomes: []})} />)
    expect(screen.queryByText('Aligned Outcomes')).not.toBeInTheDocument()
  })

  it('disables the expansion toggle button if no outcomes are aligned', () => {
    render(<AlignmentWidget {...makeProps({alignedOutcomes: []})} />)
    const button = screen.getByRole('button', {name: /Expand the list of aligned Outcomes/i})
    expect(button).toBeDisabled()
  })

  it('renders the alignment list collapsed by default', () => {
    render(<AlignmentWidget {...makeProps()} />)
    expect(screen.queryByText(OUTCOME_1.title)).not.toBeInTheDocument()
    expect(screen.queryByText(OUTCOME_2.title)).not.toBeInTheDocument()
    expect(screen.queryByText(OUTCOME_3.title)).not.toBeInTheDocument()
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument()
  })

  it('expansion toggle click is correctly handled', () => {
    render(<AlignmentWidget {...makeProps()} />)
    const expandButton = screen.getByRole('button', {name: /Expand the list of aligned Outcomes/i})
    fireEvent.click(expandButton)

    expect(screen.getByText(OUTCOME_1.title)).toBeInTheDocument()
    expect(screen.getByText(OUTCOME_2.title)).toBeInTheDocument()
    expect(screen.getByText(OUTCOME_3.title)).toBeInTheDocument()

    expect(screen.getByTestId('icon-arrow-down')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {name: /Collapse the list of aligned Outcomes/i})
    ).toBeInTheDocument()
  })

  it('collapse toggle button click is correctly handled', () => {
    render(<AlignmentWidget {...makeProps()} />)

    const expandButton = screen.getByRole('button', {name: /Expand the list of aligned Outcomes/i})
    fireEvent.click(expandButton)

    const collapseButton = screen.getByRole('button', {
      name: /Collapse the list of aligned Outcomes/i,
    })
    fireEvent.click(collapseButton)

    expect(screen.queryByText(OUTCOME_1.title)).not.toBeInTheDocument()

    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {name: /Expand the list of aligned Outcomes/i})
    ).toBeInTheDocument()
  })

  it('calls openOutcomePicker when the button is pressed', () => {
    const props = makeProps()
    const {container} = render(<AlignmentWidget {...props} />)

    const addButton = container.querySelector('[data-automation="alignmentWidget__button"]')
    fireEvent.click(addButton)

    expect(props.openOutcomePicker).toHaveBeenCalled()
  })

  it('renders AlignmentItems for each aligned outcome when expanded', () => {
    render(<AlignmentWidget {...makeProps()} />)

    const expandButton = screen.getByRole('button', {name: /Expand the list of aligned Outcomes/i})
    fireEvent.click(expandButton)

    expect(screen.getByText(OUTCOME_1.title)).toBeInTheDocument()
    expect(screen.getByText(OUTCOME_2.title)).toBeInTheDocument()
    expect(screen.getByText(OUTCOME_3.title)).toBeInTheDocument()
  })

  it('renders an AlignmentCount object', () => {
    render(<AlignmentWidget {...makeProps()} />)
    expect(screen.getByText('(3)')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<AlignmentWidget {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  describe('when an alignment is removed', () => {
    it('calls the removeAlignment action with shouldUpdateArtifact equal to true', () => {
      const props = makeProps()
      render(<AlignmentWidget {...props} />)

      const expandButton = screen.getByRole('button', {
        name: /Expand the list of aligned Outcomes/i,
      })
      fireEvent.click(expandButton)

      const removeButtons = screen.getAllByRole('button', {name: /remove/i})
      fireEvent.click(removeButtons[0])

      expect(props.removeAlignment).toHaveBeenCalledWith(OUTCOME_1.id, props.onUpdate, true)
    })

    it('handles focus management after removing outcomes', () => {
      const props = makeProps()
      const {rerender, container} = render(<AlignmentWidget {...props} />)

      rerender(<AlignmentWidget {...makeProps({alignedOutcomes: []})} />)

      const addButton = container.querySelector('[data-automation="alignmentWidget__button"]')
      expect(addButton).toBeInTheDocument()
    })
  })

  describe('componentDidUpdate', () => {
    it('should handle when alignments are removed', () => {
      const outcomes = {alignedOutcomes: [OUTCOME_1]}
      const {rerender, container} = render(<AlignmentWidget {...makeProps(outcomes)} />)

      const addButton = container.querySelector('[data-automation="alignmentWidget__button"]')
      expect(addButton).toBeInTheDocument()

      rerender(<AlignmentWidget {...makeProps({alignedOutcomes: []})} />)

      expect(
        container.querySelector('[data-automation="alignmentWidget__button"]')
      ).toBeInTheDocument()
    })
  })
})
