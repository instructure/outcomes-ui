import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {ScoreWithLabel, ScoreWithLabelProps} from '../ScoreWithLabel'
import {ScoreDisplayFormat} from '@/util/gradebook/constants'

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
  })

  it('uses default ICON_ONLY format when not specified', () => {
    render(<ScoreWithLabel {...defaultProps} />)
    expect(screen.queryByText('Mastery')).not.toBeInTheDocument()
  })
})
