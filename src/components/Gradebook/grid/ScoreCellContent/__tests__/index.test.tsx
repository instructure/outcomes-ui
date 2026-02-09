import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {ScoreCellContent, ScoreCellContentProps} from '../index'
import {ScoreDisplayFormat} from '@/util/gradebook/constants'

describe('ScoreCellContent', () => {
  const defaultProps: ScoreCellContentProps = {
    masteryLevel: 'exceeds_mastery',
    score: 3,
    label: 'Mastery',
    scoreDisplayFormat: ScoreDisplayFormat.ICON_ONLY,
  }

  it('passes props to ScoreWithLabel component', () => {
    render(
      <ScoreCellContent
        {...defaultProps}
        scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_LABEL}
      />,
    )
    expect(screen.getByText('Mastery')).toBeInTheDocument()
  })

  describe('action button visibility', () => {
    it('does not show action button by default', () => {
      render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} />)
      expect(screen.queryByTestId('score-cell-action-button')).not.toBeInTheDocument()
    })

    it('shows action button when focus is true', () => {
      render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} focus={true} />)
      expect(screen.getByTestId('score-cell-action-button')).toBeInTheDocument()
    })

    it('shows action button on hover (internal state)', () => {
      const {container} = render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} />)

      expect(screen.queryByTestId('score-cell-action-button')).not.toBeInTheDocument()

      const viewElement = container.querySelector('[class*="view"]') as HTMLElement
      fireEvent.mouseEnter(viewElement)

      expect(screen.getByTestId('score-cell-action-button')).toBeInTheDocument()
    })

    it('hides action button on mouse leave (internal state)', () => {
      const {container} = render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} />)
      const viewElement = container.querySelector('[class*="view"]') as HTMLElement

      fireEvent.mouseEnter(viewElement)
      expect(screen.getByTestId('score-cell-action-button')).toBeInTheDocument()

      fireEvent.mouseLeave(viewElement)
      expect(screen.queryByTestId('score-cell-action-button')).not.toBeInTheDocument()
    })

    it('shows action button when hover prop is true (controlled)', () => {
      render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} hover={true} />)
      expect(screen.getByTestId('score-cell-action-button')).toBeInTheDocument()
    })

    it('does not update internal hover state when hover prop is controlled', () => {
      const {container} = render(<ScoreCellContent {...defaultProps} onAction={jest.fn()} hover={false} />)
      const viewElement = container.querySelector('[class*="view"]') as HTMLElement

      fireEvent.mouseEnter(viewElement)

      // Button should not appear because hover prop is controlled and set to false
      expect(screen.queryByTestId('score-cell-action-button')).not.toBeInTheDocument()
    })
  })

  describe('action button interaction', () => {
    it('calls onAction when action button is clicked', () => {
      const onAction = jest.fn()
      render(<ScoreCellContent {...defaultProps} onAction={onAction} focus={true} />)

      const button = screen.getByTestId('score-cell-action-button')
      fireEvent.click(button)

      expect(onAction).toHaveBeenCalledTimes(1)
    })

    it('disables action button when onAction is undefined', () => {
      render(<ScoreCellContent {...defaultProps} onAction={undefined} focus={true} />)

      expect(screen.queryByTestId('score-cell-action-button')).toHaveAttribute('disabled')
    })
  })

  describe('scoreDisplayFormat', () => {
    it('renders with ICON_ONLY format', () => {
      render(
        <ScoreCellContent {...defaultProps} scoreDisplayFormat={ScoreDisplayFormat.ICON_ONLY} />,
      )
      expect(screen.queryByText('Mastery')).not.toBeInTheDocument()
      expect(screen.queryByText('3')).not.toBeInTheDocument()
    })

    it('renders with ICON_AND_LABEL format', () => {
      render(
        <ScoreCellContent
          {...defaultProps}
          scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_LABEL}
        />,
      )
      expect(screen.getByText('Mastery')).toBeInTheDocument()
    })

    it('renders with ICON_AND_POINTS format', () => {
      render(
        <ScoreCellContent
          {...defaultProps}
          scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_POINTS}
        />,
      )
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })
})
