import React from 'react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {expect, jest} from '@jest/globals'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Alignment from '../index'

expect.extend(toHaveNoViolations)

describe('Alignment', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        outcome: {
          id: '1',
          label: 'FOO',
          title: 'User can foo a bar',
        },
        closeAlignment: jest.fn(),
        viewAlignment: jest.fn(),
        removeAlignment: jest.fn(),
        isOpen: false,
        readOnly: false,
        scope: 'artifactType:artifactId',
        index: 0,
      },
      props
    )
  }

  it('shows source context name', () => {
    const props = makeProps({
      outcome: {
        id: '1',
        label: 'FOO',
        title: 'User can foo a bar',
        source_context_info: {name: 'Source Context'},
      },
    })
    render(<Alignment {...props} />)
    expect(screen.getByText('Source Context')).toBeInTheDocument()
  })

  it('handles null source context name', () => {
    const props = makeProps({
      outcome: {
        id: '1',
        label: 'FOO',
        title: 'User can foo a bar',
        source_context_info: {name: null},
      },
    })
    render(<Alignment {...props} />)
    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })

  it('handles null source context info', () => {
    render(<Alignment {...makeProps()} />)
    expect(screen.getByText('User can foo a bar')).toBeInTheDocument()
  })

  describe('renderOutcomeDecoration', () => {
    function getDecoratedOutcome(decorator) {
      return makeProps({
        outcome: {
          id: '1',
          label: 'FOO',
          title: 'User can foo a bar',
          source_context_info: {name: null},
          decorator: decorator,
        },
      })
    }

    it('does not decorate if there is no decorator', () => {
      render(<Alignment {...makeProps()} />)
      expect(screen.queryByText('Sub-Account Outcome')).not.toBeInTheDocument()
      expect(screen.queryByText('Course Outcome')).not.toBeInTheDocument()
    })

    it('does not render if decorator is HIDE', () => {
      const props = getDecoratedOutcome('HIDE')
      render(<Alignment {...props} />)
      expect(screen.queryByText('User can foo a bar')).not.toBeInTheDocument()
    })

    it('decorates if decorator is SUB_ACCOUNT_OUTCOME', () => {
      const props = getDecoratedOutcome('SUB_ACCOUNT_OUTCOME')
      render(<Alignment {...props} />)
      const pill = screen.getByText('Sub-Account Outcome')
      expect(pill).toBeInTheDocument()

      expect(
        screen.queryByText('To add this outcome, navigate to the Outcomes Management page.')
      ).not.toBeInTheDocument()
    })

    it('decorates if decorator is NOT_IN_SUB_ACCOUNT', () => {
      const props = getDecoratedOutcome('NOT_IN_SUB_ACCOUNT')
      render(<Alignment {...props} />)
      const pill = screen.getByText('Not in this Sub-Account')
      expect(pill).toBeInTheDocument()

      expect(
        screen.getByText('To add this outcome, navigate to the Outcomes Management page.')
      ).toBeInTheDocument()
    })

    it('decorates if decorator is COURSE_OUTCOME', () => {
      const props = getDecoratedOutcome('COURSE_OUTCOME')
      render(<Alignment {...props} />)
      const pill = screen.getByText('Course Outcome')
      expect(pill).toBeInTheDocument()

      expect(
        screen.queryByText('To add this outcome, navigate to the Outcomes Management page.')
      ).not.toBeInTheDocument()
    })

    it('decorates if decorator is NOT_IN_COURSE', () => {
      const props = getDecoratedOutcome('NOT_IN_COURSE')
      render(<Alignment {...props} />)
      const pill = screen.getByText('Not in this Course')
      expect(pill).toBeInTheDocument()

      expect(
        screen.getByText('To add this outcome, navigate to the Outcomes Management page.')
      ).toBeInTheDocument()
    })
  })

  it('includes an icon', () => {
    render(<Alignment {...makeProps()} />)
    const icons = screen.getAllByRole('img', {hidden: true})
    expect(icons.length).toBeGreaterThan(0)
  })

  it('includes a delete button', () => {
    const props = makeProps()
    render(<Alignment {...props} />)
    const deleteButton = screen.getByTitle(/Remove User can foo a bar/i)
    expect(deleteButton).toBeInTheDocument()
  })

  it('does not include a delete button if readOnly', () => {
    const props = makeProps({readOnly: true})
    render(<Alignment {...props} />)
    const deleteButton = screen.queryByTitle(/Remove User can foo a bar/i)
    expect(deleteButton).not.toBeInTheDocument()
  })

  it('calls removeAlignment when delete is clicked', () => {
    const props = makeProps()
    render(<Alignment {...props} />)
    const deleteButton = screen.getByTitle(/Remove User can foo a bar/i)
    fireEvent.click(deleteButton)
    expect(props.removeAlignment).toHaveBeenCalled()
  })

  it('calls viewAlignment when the title is clicked', () => {
    const props = makeProps()
    render(<Alignment {...props} />)
    const button = screen.getByText('User can foo a bar')
    fireEvent.click(button)
    expect(props.viewAlignment).toHaveBeenCalled()
  })

  it('renders outcome title in button', () => {
    const props = makeProps()
    render(<Alignment {...props} />)
    const button = screen.getByRole('button', {name: 'User can foo a bar'})
    expect(button).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<Alignment {...makeProps()} />)
    const results = await axe(container, {
      rules: {
        listitem: {enabled: false},
      },
    })
    expect(results).toHaveNoViolations()
  })
})
