import React from 'react'
import type { DragLayerMonitor } from 'react-dnd'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { CustomDragLayer } from '../index'

interface DragItem {
  id: string | number
  index: number
  originalIndex: number
  label?: string
}

const mockDragLayerState = {
  item: null as DragItem | null,
  currentOffset: null as {x: number; y: number} | null,
  isDragging: false,
}

jest.mock('react-dnd/lib/DragLayer', () => {
  const mockReact = jest.requireActual('react')

  const mockDragLayer = jest.fn(
    <T extends Record<string, unknown>>(collect: (monitor: DragLayerMonitor) => T) =>
      <P extends Record<string, unknown>>(component: React.ComponentType<Record<string, unknown>>) => {
        const WrappedComponent = (props: P) => {
          const mockMonitor = {
            getItem: () => mockDragLayerState.item,
            getSourceClientOffset: () => mockDragLayerState.currentOffset,
            isDragging: () => mockDragLayerState.isDragging,
          } as DragLayerMonitor
          const collectedProps = collect(mockMonitor)
          return mockReact.createElement(component, { ...props, ...collectedProps })
        }
        return WrappedComponent
      },
  )

  return {
    __esModule: true,
    default: mockDragLayer,
  }
})

describe('CustomDragLayer', () => {
  beforeEach(() => {
    mockDragLayerState.item = null
    mockDragLayerState.currentOffset = null
    mockDragLayerState.isDragging = false
    jest.clearAllMocks()
  })

  describe('when not dragging', () => {
    it('renders nothing when isDragging is false', () => {
      mockDragLayerState.isDragging = false
      const { container } = render(<CustomDragLayer />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render even if item and offset are present', () => {
      mockDragLayerState.isDragging = false
      mockDragLayerState.item = { id: '1', index: 0, originalIndex: 0, label: 'Test Item' }
      mockDragLayerState.currentOffset = { x: 100, y: 200 }
      const { container } = render(<CustomDragLayer />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('when dragging', () => {
    beforeEach(() => {
      mockDragLayerState.isDragging = true
      mockDragLayerState.item = { id: '1', index: 0, originalIndex: 0, label: 'Test Item' }
      mockDragLayerState.currentOffset = { x: 100, y: 200 }
    })

    it('renders the drag layer container', () => {
      const { container } = render(<CustomDragLayer />)
      const dragLayer = container.firstChild as HTMLElement
      expect(dragLayer).toBeInTheDocument()
      expect(dragLayer).toHaveStyle({
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '1000',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
      })
    })

    it('renders default label when no renderItem is provided', () => {
      render(<CustomDragLayer />)
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    it('renders "Dragging..." as fallback when item has no label', () => {
      mockDragLayerState.item = { id: '1', index: 0, originalIndex: 0 }
      render(<CustomDragLayer />)
      expect(screen.getByText('Dragging...')).toBeInTheDocument()
    })

    it('applies transform styles based on currentOffset', () => {
      mockDragLayerState.currentOffset = { x: 150, y: 250 }
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(150px, 250px)')
      expect(styleAttr).toContain('width: 160px')
      expect(styleAttr).toContain('height: 48px')
    })

    it('hides the layer when currentOffset is null', () => {
      mockDragLayerState.currentOffset = null
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('display: none')
    })

    it('applies fixed width and height from constants', () => {
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      // COLUMN_WIDTH = 160, CELL_HEIGHT = 48 from constants
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('width: 160px')
      expect(styleAttr).toContain('height: 48px')
    })

    it('renders custom content with renderItem prop', () => {
      const renderItem = (item: DragItem) => (
        <div data-testid="custom-content">Custom: {item.label}</div>
      )
      render(<CustomDragLayer renderItem={renderItem} />)
      const customContent = screen.getByTestId('custom-content')
      expect(customContent).toBeInTheDocument()
      expect(customContent).toHaveTextContent('Custom: Test Item')
    })

    it('calls renderItem with the dragged item', () => {
      const renderItem = jest.fn().mockReturnValue(<div>Rendered</div>)
      const draggedItem = { id: 'abc', index: 2, originalIndex: 1, label: 'Column A' }
      mockDragLayerState.item = draggedItem
      render(<CustomDragLayer renderItem={renderItem} />)
      expect(renderItem).toHaveBeenCalledWith(draggedItem)
    })

    it('handles renderItem returning null', () => {
      const renderItem = jest.fn().mockReturnValue(null)
      const { container } = render(<CustomDragLayer renderItem={renderItem} />)
      // Component should still render the container
      expect(container.firstChild).toBeInTheDocument()
      expect(renderItem).toHaveBeenCalled()
    })

    it('updates position when currentOffset changes', () => {
      mockDragLayerState.currentOffset = { x: 100, y: 200 }
      const { container, unmount } = render(<CustomDragLayer />)
      let innerDiv = (container.firstChild?.firstChild) as HTMLElement
      let styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(100px, 200px)')

      unmount()
      mockDragLayerState.currentOffset = { x: 300, y: 400 }
      const { container: container2 } = render(<CustomDragLayer />)
      innerDiv = (container2.firstChild?.firstChild) as HTMLElement
      styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(300px, 400px)')
    })

    it('updates content when item changes', () => {
      mockDragLayerState.item = { id: '1', index: 0, originalIndex: 0, label: 'Item 1' }
      const { unmount } = render(<CustomDragLayer />)
      expect(screen.getByText('Item 1')).toBeInTheDocument()

      unmount()
      mockDragLayerState.item = { id: '2', index: 1, originalIndex: 1, label: 'Item 2' }
      render(<CustomDragLayer />)
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('applies correct styling to the View component', () => {
      const { container } = render(<CustomDragLayer />)
      const viewDiv = (container.firstChild?.firstChild?.firstChild) as HTMLElement
      // The View component applies styles via CSS classes (emotion), so just check it renders
      expect(viewDiv).toBeInTheDocument()
      expect(viewDiv).toHaveClass('css-j5pcyx-view')
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    it('handles drag at origin (0, 0)', () => {
      mockDragLayerState.currentOffset = { x: 0, y: 0 }
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(0px, 0px)')
    })

    it('handles negative coordinates', () => {
      mockDragLayerState.currentOffset = { x: -50, y: -100 }
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(-50px, -100px)')
    })

    it('handles large coordinate values', () => {
      mockDragLayerState.currentOffset = { x: 9999, y: 9999 }
      const { container } = render(<CustomDragLayer />)
      const innerDiv = (container.firstChild?.firstChild) as HTMLElement
      const styleAttr = innerDiv.getAttribute('style') || ''
      expect(styleAttr).toContain('transform: translate(9999px, 9999px)')
    })

    it('transitions from dragging to not dragging', () => {
      mockDragLayerState.isDragging = true
      const { container, unmount } = render(<CustomDragLayer />)
      expect(container.firstChild).toBeInTheDocument()

      unmount()
      mockDragLayerState.isDragging = false
      const { container: container2 } = render(<CustomDragLayer />)
      expect(container2.firstChild).toBeNull()
    })

    it('transitions from not dragging to dragging', () => {
      mockDragLayerState.isDragging = false
      const { container, unmount } = render(<CustomDragLayer />)
      expect(container.firstChild).toBeNull()

      unmount()
      mockDragLayerState.isDragging = true
      const { container: container2 } = render(<CustomDragLayer />)
      expect(container2.firstChild).toBeInTheDocument()
    })

    it('handles renderItem with complex JSX', () => {
      const renderItem = (item: DragItem) => (
        <div>
          <span data-testid="icon">📋</span>
          <strong data-testid="title">{item.label}</strong>
          <em data-testid="index">Index: {item.index}</em>
        </div>
      )
      render(<CustomDragLayer renderItem={renderItem} />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByTestId('title')).toHaveTextContent('Test Item')
      expect(screen.getByTestId('index')).toHaveTextContent('Index: 0')
    })

    it('does not render default content when renderItem is provided', () => {
      const renderItem = () => <div>Custom</div>
      render(<CustomDragLayer renderItem={renderItem} />)
      expect(screen.queryByText('Test Item')).not.toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('handles item with only id and indices', () => {
      mockDragLayerState.item = { id: 'minimal', index: 5, originalIndex: 3 }
      render(<CustomDragLayer />)
      expect(screen.getByText('Dragging...')).toBeInTheDocument()
    })

    it('handles renderItem with empty string return', () => {
      const renderItem = () => ''
      const { container } = render(<CustomDragLayer renderItem={renderItem} />)
      const viewDiv = (container.firstChild?.firstChild?.firstChild) as HTMLElement
      expect(viewDiv).toBeInTheDocument()
      expect(viewDiv).toHaveTextContent('')
    })

    it('preserves pointer-events: none to prevent interaction', () => {
      const { container } = render(<CustomDragLayer />)
      const dragLayer = container.firstChild as HTMLElement
      expect(dragLayer).toHaveStyle({ pointerEvents: 'none' })
    })

    it('maintains high z-index for visibility above other elements', () => {
      const { container } = render(<CustomDragLayer />)
      const dragLayer = container.firstChild as HTMLElement
      expect(dragLayer).toHaveStyle({ zIndex: '1000' })
    })
  })
})
