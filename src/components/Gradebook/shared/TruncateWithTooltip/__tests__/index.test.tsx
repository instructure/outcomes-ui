import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TruncateWithTooltip from '..'

// Mock the TruncateText component to control truncation behavior
jest.mock('@instructure/ui-truncate-text', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockTruncateText = ({ children, onUpdate }: any) => {
    // Simulate truncation for long text synchronously
    const text = typeof children === 'string' ? children : ''
    const isTruncated = text.length > 50

    // Call onUpdate immediately to simulate truncation detection
    if (onUpdate) {
      setTimeout(() => onUpdate(isTruncated), 0)
    }

    return <div data-testid="truncate-text">{children}</div>
  }

  return {
    TruncateText: MockTruncateText,
  }
})

describe('TruncateWithTooltip', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children text', () => {
    render(<TruncateWithTooltip>Short text</TruncateWithTooltip>)
    expect(screen.getByText('Short text')).toBeInTheDocument()
  })

  it('renders without tooltip for short text', () => {
    render(<TruncateWithTooltip>Short text</TruncateWithTooltip>)

    // Tooltip should not be present for non-truncated text
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders with tooltip for long text', async () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(<TruncateWithTooltip>{longText}</TruncateWithTooltip>)

    // The text should be rendered
    expect(screen.getByText(longText)).toBeInTheDocument()

    // Wait for the state update and check that TruncateText is rendered
    await waitFor(() => {
      expect(screen.getByTestId('truncate-text')).toBeInTheDocument()
    })
  })

  it('passes maxTooltipWidth prop correctly', async () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(
      <TruncateWithTooltip maxTooltipWidth="30rem">{longText}</TruncateWithTooltip>
    )

    // Wait for the state update to happen and check the tooltip content
    // Tooltip is rendered in a portal, so we need to query from document
    await waitFor(() => {
      const tooltipContent = document.querySelector('div[style*="max-width"]')
      expect(tooltipContent).toBeInTheDocument()
      expect(tooltipContent).toHaveStyle({ maxWidth: '30rem' })
    })
  })

  it('uses default maxTooltipWidth of 20rem', async () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(<TruncateWithTooltip>{longText}</TruncateWithTooltip>)

    // Wait for the state update and check the default max-width
    // Tooltip is rendered in a portal, so we need to query from document
    await waitFor(() => {
      const tooltipContent = document.querySelector('div[style*="max-width"]')
      expect(tooltipContent).toBeInTheDocument()
      expect(tooltipContent).toHaveStyle({ maxWidth: '20rem' })
    })
  })

  it('renders with custom linesAllowed prop', () => {
    render(<TruncateWithTooltip linesAllowed={2}>Test text</TruncateWithTooltip>)

    // The component should render with the TruncateText component
    expect(screen.getByTestId('truncate-text')).toBeInTheDocument()
  })

  it('handles placement prop for tooltip', () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(<TruncateWithTooltip placement="bottom">{longText}</TruncateWithTooltip>)

    // The component should render
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('handles backgroundColor prop', () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(
      <TruncateWithTooltip backgroundColor="primary-inverse">{longText}</TruncateWithTooltip>
    )

    // The component should render
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('handles horizontalOffset prop', () => {
    const longText = 'This is a very long text that will definitely be truncated by the component'

    render(<TruncateWithTooltip horizontalOffset={10}>{longText}</TruncateWithTooltip>)

    // The component should render
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('updates truncation state when text changes', () => {
    const { rerender } = render(<TruncateWithTooltip>Short</TruncateWithTooltip>)

    expect(screen.getByText('Short')).toBeInTheDocument()

    // Change to long text
    const longText = 'This is a very long text that will definitely be truncated by the component'
    rerender(<TruncateWithTooltip>{longText}</TruncateWithTooltip>)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('renders non-string children', () => {
    render(
      <TruncateWithTooltip>
        <span>Child element</span>
      </TruncateWithTooltip>
    )

    expect(screen.getByText('Child element')).toBeInTheDocument()
  })
})
