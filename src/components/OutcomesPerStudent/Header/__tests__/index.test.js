import React from 'react'
import { expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import Header from '../index'

// eslint-disable-next-line no-undef
jest.mock('@instructure/ui-a11y-content', (props) => ({
  AccessibleContent: ({ children, ...props }) => <div data-testid="accessible-content" {...props}>
    {children}
  </div>,
  PresentationContent: ({ children, ...props }) => <div data-testid="presentation-content" {...props}>
    {children}
  </div>
}))

// eslint-disable-next-line no-undef
jest.mock('@instructure/ui-tooltip', () => ({
  Tooltip: ({ children, ...props }) => <div data-testid="ui-tooltip" {...props}>
    {children}
  </div>
}))

// eslint-disable-next-line no-undef
jest.mock('@instructure/ui-truncate-text', () => ({
  // eslint-disable-next-line no-undef
  TruncateText: jest.fn(({ children, onUpdate, ...props }) => (
    <button data-testid="truncate-text" {...props} onClick={() => onUpdate(true)}>
      {children}
    </button>
  ))
}))

import { TruncateText } from '@instructure/ui-truncate-text'

expect.extend(toHaveNoViolations)

describe('OutcomesPerStudent/Header', () => {
  function makeProps (props) {
    return Object.assign({
      outcomeResult: {
        outcome: {
          id: '1',
          label: 'FOO'
        },
        count: 10,
        mastery_count: 5,
        childArtifactCount: 12
      },
      scope: 'artifactType::artifactId',
      // eslint-disable-next-line no-undef
      viewReportAlignment: jest.fn(),
      // eslint-disable-next-line no-undef
      getReportOutcome: jest.fn().mockReturnValue({ id: '1', label: 'FOO', title: 'bar' }),
      isOpen: false,
      // eslint-disable-next-line no-undef
      closeReportAlignment: jest.fn()
    }, props)
  }

  it('includes a details object', () => {
    const { container } = render(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(container.querySelectorAll('[data-automation="outcomesPerStudent__masteryBarDetails"]').length).toEqual(1)
  })

  it('renders outcome link with title', () => {
    const props = makeProps()
    render(<Header {...props} />)
    expect(screen.getByText(/bar/)).toBeInTheDocument()
  })

  it('calls viewReportAlignment when the link is clicked', () => {
    const props = makeProps()
    render(<Header {...props} />, {disableLifecycleMethods: true})
    const buttons = screen.getAllByRole('button')
      .filter((el) => el.getAttribute('data-testid') !== 'truncate-text')
    expect(buttons.length).toEqual(1)
    fireEvent.click(buttons[0])
    expect(props.viewReportAlignment).toHaveBeenCalledTimes(1)
  })

  it('conditionally renders tooltip when TruncateText is updated', () => {
    render(<Header {...makeProps()} />)
    expect(screen.queryByTestId('ui-tooltip')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('truncate-text'))
    expect(screen.getByTestId('ui-tooltip')).toBeInTheDocument()
  })

  it('includes a AccessibleContent element', () => {
    render(<Header {...makeProps()} />, {disableLifecycleMethods: true})
    expect(screen.getByTestId('accessible-content')).toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    TruncateText.mockImplementation(({ onUpdate, ...props }) => (
      <div data-testid="truncate-text" {...props}>
        Truncate Text
      </div>
    ))
    const { container } = render(<Header {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
