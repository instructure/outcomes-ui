import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import AlignmentList from '../index'

expect.extend(toHaveNoViolations)

describe('AlignmentList', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        alignedOutcomes: [
          {id: '1', label: 'A1', title: 'tA1'},
          {id: '2', label: 'B2', title: 'tB2'},
          {id: '3', label: 'C3', title: 'tC3'},
        ],
        emptySetHeading: 'Foo',
        scope: 'scopeForTest',
        viewAlignment: jest.fn(),
        closeAlignment: jest.fn(),
        removeAlignment: jest.fn(),
        onUpdate: jest.fn(),
        isOpen: jest.fn().mockReturnValue(false),
        setOutcomePickerState: jest.fn(),
        openOutcomePicker: jest.fn(),
        screenreaderNotification: jest.fn(),
        addModal: () => null,
        outcomePicker: () => null,
        readOnly: false,
        onModalClose: () => null,
      },
      props
    )
  }

  describe('no alignments present', () => {
    const props = makeProps({alignedOutcomes: []})

    it('shows billboard when no alignments present', () => {
      render(<AlignmentList {...props} />)
      expect(screen.getByText('Foo')).toBeInTheDocument()
    })

    it('does not show the billboard when readOnly is true', () => {
      const props = makeProps({alignedOutcomes: [], readOnly: true})
      const {container} = render(<AlignmentList {...props} />)
      expect(container.querySelector('[data-testid="billboard"]')).toBeNull()
    })

    it('includes the right heading', () => {
      render(<AlignmentList {...props} />)
      expect(screen.getByText('Foo')).toBeInTheDocument()
    })

    it('launches modal when billboard clicked', () => {
      render(<AlignmentList {...props} />)
      const button = screen.getByRole('button', {name: /Browse and add outcomes by clicking here/i})
      fireEvent.click(button)
      expect(props.openOutcomePicker).toHaveBeenCalledTimes(1)
    })

    it('meets a11y standards', async () => {
      const {container} = render(<AlignmentList {...props} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('alignments present', () => {
    it('shows list', () => {
      const {container} = render(<AlignmentList {...makeProps()} />)
      expect(container.querySelector('ul')).toBeInTheDocument()
    })

    it('adds one alignment row per alignment', () => {
      const {container} = render(<AlignmentList {...makeProps()} />)
      const alignmentItems = container.querySelectorAll(
        '[data-automation="outcomeAlignment__item"]'
      )
      expect(alignmentItems.length).toBe(3)
    })

    it('renders alignments with correct titles', () => {
      render(<AlignmentList {...makeProps()} />)
      expect(screen.getByText('tA1')).toBeInTheDocument()
      expect(screen.getByText('tB2')).toBeInTheDocument()
      expect(screen.getByText('tC3')).toBeInTheDocument()
    })

    it('gives correct callbacks to alignment rows', async () => {
      const props = makeProps()
      render(<AlignmentList {...props} />)
      const removeButtons = screen.getAllByRole('button', {name: /remove/i})
      fireEvent.click(removeButtons[0])
      expect(props.removeAlignment).toHaveBeenCalledWith('1', props.onUpdate)
    })

    it('renders a trigger button when readOnly is false', () => {
      render(<AlignmentList {...makeProps()} />)
      expect(screen.getByRole('button', {name: /Align new outcomes/i})).toBeInTheDocument()
    })

    it('does not render a trigger button when readOnly is true', () => {
      render(<AlignmentList {...makeProps({readOnly: true})} />)
      expect(screen.queryByRole('button', {name: /Align new outcomes/i})).toBeNull()
    })

    it('launches modal when trigger button clicked', () => {
      const props = makeProps()
      render(<AlignmentList {...props} />)
      const addButton = screen.getByRole('button', {name: /Align new outcomes/i})
      fireEvent.click(addButton)
      expect(props.openOutcomePicker).toHaveBeenCalledTimes(1)
    })

    it('generates screenreader notification when removing an alignment', async () => {
      const props = makeProps()
      render(<AlignmentList {...props} />)
      const removeButtons = screen.getAllByRole('button', {name: /remove/i})
      fireEvent.click(removeButtons[0])

      await waitFor(() => {
        expect(props.screenreaderNotification).toHaveBeenCalledTimes(1)
        expect(props.screenreaderNotification.mock.calls[0][0]).toContain('A1')
      })
    })

    it('meets a11y standards', async () => {
      const {container} = render(<AlignmentList {...makeProps()} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('outcome decoration', () => {
    it('behaves as empty if all outcomes are hidden', () => {
      const props = makeProps({
        alignedOutcomes: [
          {id: '1', label: 'A1', title: 'tA1', decorator: 'HIDE'},
          {id: '2', label: 'B2', title: 'tB2', decorator: 'HIDE'},
          {id: '3', label: 'C3', title: 'tC3', decorator: 'HIDE'},
        ],
      })
      render(<AlignmentList {...props} />)
      expect(screen.getByText('Foo')).toBeInTheDocument()
      expect(screen.getByText('Browse and add outcomes by clicking here.')).toBeInTheDocument()
    })

    it('filters out outcomes with HIDE decorator but shows others', () => {
      const props = makeProps({
        alignedOutcomes: [
          {id: '1', label: 'A1', title: 'tA1', decorator: 'HIDE'},
          {id: '2', label: 'B2', title: 'tB2'}, // No decorator
          {id: '3', label: 'C3', title: 'tC3', decorator: 'HIDE'},
        ],
      })
      const {container} = render(<AlignmentList {...props} />)

      expect(container.querySelector('ul')).toBeInTheDocument()

      expect(screen.getByText('tB2')).toBeInTheDocument()
      expect(screen.queryByText('tA1')).toBeNull()
      expect(screen.queryByText('tC3')).toBeNull()
      const alignmentItems = container.querySelectorAll(
        '[data-automation="outcomeAlignment__item"]'
      )
      expect(alignmentItems.length).toBe(1)
    })
  })
})
