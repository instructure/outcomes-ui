import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScoreDisplayFormat } from '@/util/gradebook/constants'
import { ScoreWithLabel, ScoreWithLabelProps } from '../ScoreWithLabel'

describe('ScoreWithLabel', () => {
  const defaultProps: ScoreWithLabelProps = {
    masteryLevel: 'exceeds_mastery',
    score: 3,
    label: 'Mastery',
  }

  it('renders with icon and label', () => {
    render(
      <ScoreWithLabel {...defaultProps} scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_LABEL} />,
    )
    expect(screen.getByText('Mastery')).toBeInTheDocument()
  })

  describe('scoreDisplayFormat', () => {
    it('shows label in ScreenReaderContent with ICON_ONLY format (default)', () => {
      render(<ScoreWithLabel {...defaultProps} scoreDisplayFormat={ScoreDisplayFormat.ICON_ONLY} />)
      expect(screen.queryByText('Mastery')).not.toBeInTheDocument()
    })

    it('shows visible label with ICON_AND_LABEL format', () => {
      render(
        <ScoreWithLabel {...defaultProps} scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_LABEL} />,
      )
      const labelText = screen.getByText('Mastery')
      expect(labelText).toBeInTheDocument()
      expect(labelText.closest('[class*="screenReaderContent"]')).not.toBeInTheDocument()
    })

    it('shows visible score with ICON_AND_POINTS format', () => {
      render(
        <ScoreWithLabel
          {...defaultProps}
          scoreDisplayFormat={ScoreDisplayFormat.ICON_AND_POINTS}
        />,
      )
      const pointsText = screen.getByText('3')
      expect(pointsText).toBeInTheDocument()
      expect(pointsText.closest('[class*="screenReaderContent"]')).not.toBeInTheDocument()
    })

    it('shows percent with PERCENT format', () => {
      render(
        <ScoreWithLabel
          {...defaultProps}
          score={3}
          totalScore={4}
          scoreDisplayFormat={ScoreDisplayFormat.PERCENT}
        />,
      )
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('does not show mastery icon with PERCENT format', () => {
      const { container } = render(
        <ScoreWithLabel
          {...defaultProps}
          score={3}
          totalScore={4}
          scoreDisplayFormat={ScoreDisplayFormat.PERCENT}
        />,
      )
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('shows percent and ratio with PERCENT_AND_RATIO format', () => {
      render(
        <ScoreWithLabel
          {...defaultProps}
          score={3}
          totalScore={4}
          scoreDisplayFormat={ScoreDisplayFormat.PERCENT_AND_RATIO}
        />,
      )
      expect(screen.getByText('75%')).toBeInTheDocument()
      expect(screen.getByText('(3/4)')).toBeInTheDocument()
    })

    it('does not show mastery icon with PERCENT_AND_RATIO format', () => {
      const { container } = render(
        <ScoreWithLabel
          {...defaultProps}
          score={3}
          totalScore={4}
          scoreDisplayFormat={ScoreDisplayFormat.PERCENT_AND_RATIO}
        />,
      )
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('shows null when totalScore is missing with PERCENT format', () => {
      render(
        <ScoreWithLabel
          {...defaultProps}
          scoreDisplayFormat={ScoreDisplayFormat.PERCENT}
        />,
      )
      expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    })
  })

  it('uses default ICON_ONLY format when not specified', () => {
    render(<ScoreWithLabel {...defaultProps} />)
    expect(screen.queryByText('Mastery')).not.toBeInTheDocument()
  })
})
