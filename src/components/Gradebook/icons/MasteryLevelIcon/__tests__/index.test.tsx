import React from 'react'
import { expect } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import MasteryLevelIcon from '../index'
import type { MasteryLevelIconProps } from '../index'
import type { MasteryLevel } from '@/types/gradebook/rollup'

describe('MasteryLevelIcon', () => {
  const defaultProps: MasteryLevelIconProps = {
    masteryLevel: 'mastery',
  }

  describe('Rendering mastery level icons', () => {
    it.each<MasteryLevel>([
      'exceeds_mastery',
      'mastery',
      'near_mastery',
      'remediation',
      'no_evidence',
      'unassessed',
    ])('renders %s icon', (masteryLevel) => {
      const { container } = render(<MasteryLevelIcon masteryLevel={masteryLevel} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Props forwarding', () => {
    it('forwards fill prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} fill="#FF0000" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('fill', '#FF0000')
    })

    it('forwards width prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} width="50" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '50')
    })

    it('forwards numeric width prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} width={50} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '50')
    })

    it('forwards height prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} height="50" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '50')
    })

    it('forwards numeric height prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} height={50} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '50')
    })

    it('forwards style prop to SVG icon', () => {
      const customStyle = { marginLeft: '10px', opacity: 0.5 }
      const { container } = render(<MasteryLevelIcon {...defaultProps} style={customStyle} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveStyle(customStyle)
    })
  })

  describe('Accessibility props', () => {
    it('forwards aria-hidden prop to SVG icon', () => {
      const { container } = render(<MasteryLevelIcon {...defaultProps} ariaHidden={true} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('forwards aria-label prop to SVG icon', () => {
      const { container } = render(
        <MasteryLevelIcon {...defaultProps} ariaLabel="Mastery level achieved" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Mastery level achieved')
    })

    it('sets both aria-hidden and aria-label when provided', () => {
      const { container } = render(
        <MasteryLevelIcon
          {...defaultProps}
          ariaHidden={false}
          ariaLabel="Achievement indicator"
        />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'false')
      expect(svg).toHaveAttribute('aria-label', 'Achievement indicator')
    })
  })

  describe('Multiple props combination', () => {
    it('forwards all props simultaneously', () => {
      const customStyle = { transform: 'rotate(45deg)' }
      const { container } = render(
        <MasteryLevelIcon
          masteryLevel="exceeds_mastery"
          fill="#00FF00"
          width={100}
          height={100}
          style={customStyle}
          ariaHidden={true}
          ariaLabel="Exceeds mastery level"
        />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('fill', '#00FF00')
      expect(svg).toHaveAttribute('width', '100')
      expect(svg).toHaveAttribute('height', '100')
      expect(svg).toHaveStyle(customStyle)
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('aria-label', 'Exceeds mastery level')
    })
  })

  describe('Invalid mastery level handling', () => {
    let consoleWarnSpy: jest.SpyInstance

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    it('returns null for invalid mastery level', () => {
      const { container } = render(
        <MasteryLevelIcon masteryLevel={'invalid_level' as MasteryLevel} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('logs warning for invalid mastery level', () => {
      render(<MasteryLevelIcon masteryLevel={'invalid_level' as MasteryLevel} />)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'MasteryLevelIcon: No icon found for mastery level "invalid_level"'
      )
    })

    it('does not log warning for valid mastery levels', () => {
      render(<MasteryLevelIcon masteryLevel="mastery" />)
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })

  describe('Component rendering variations', () => {
    it('renders with only required masteryLevel prop', () => {
      const { container } = render(<MasteryLevelIcon masteryLevel="remediation" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders different icons for different mastery levels', () => {
      const { container: container1 } = render(<MasteryLevelIcon masteryLevel="mastery" />)
      const { container: container2 } = render(
        <MasteryLevelIcon masteryLevel="exceeds_mastery" />
      )

      const svg1 = container1.querySelector('svg')
      const svg2 = container2.querySelector('svg')

      expect(svg1).toBeInTheDocument()
      expect(svg2).toBeInTheDocument()
      // Both should be SVGs but represent different icons
      expect(svg1).not.toEqual(svg2)
    })
  })
})
