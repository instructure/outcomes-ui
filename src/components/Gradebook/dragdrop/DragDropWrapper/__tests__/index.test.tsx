import React from 'react'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockState = {
  isDragging: false,
  dragItem: null as Record<string, unknown> | null,
  didDrop: false,
}

type MockConnectDragSource = <T>(node: T) => T
type MockConnectDragPreview = <T>(node: T) => T
type MockConnectDropTarget = <T>(node: T) => T

interface MockDragConnect {
  dragSource: () => MockConnectDragSource
  dragPreview: () => MockConnectDragPreview
}

interface MockDropConnect {
  dropTarget: () => MockConnectDropTarget
}

interface MockDragMonitor {
  isDragging: () => boolean
  getItem: () => Record<string, unknown> | null
  didDrop: () => boolean
}

interface MockDropMonitor {
  getItem: () => Record<string, unknown> | null
}

type DragCollectFunction = (connect: MockDragConnect, monitor: MockDragMonitor) => Record<string, unknown>
type DropCollectFunction = (connect: MockDropConnect) => Record<string, unknown>

type DragSpec = {
  beginDrag: (props: Record<string, unknown>) => Record<string, unknown>
  endDrag: (props: Record<string, unknown>, monitor: MockDragMonitor) => void
}

type DropSpec = {
  hover: (props: Record<string, unknown>, monitor: MockDropMonitor) => void
}

type ReactComponent = React.ComponentType<Record<string, unknown>>

declare global {
  // eslint-disable-next-line no-var
  var __dragDropSpecs: {
    dragSpec: DragSpec | null
    dropSpec: DropSpec | null
  }
}

if (!global.__dragDropSpecs) {
  global.__dragDropSpecs = {
    dragSpec: null,
    dropSpec: null,
  }
}

jest.mock('react-dnd', () => {
  const mockReact = jest.requireActual('react')

  if (!global.__dragDropSpecs) {
    global.__dragDropSpecs = {
      dragSpec: null,
      dropSpec: null,
    }
  }

  const dragSourceMock = jest.fn()
  const dropTargetMock = jest.fn()

  const dragSourceImpl = (_typeOrTypesFn: unknown, spec: unknown, collect: unknown) => {
    global.__dragDropSpecs.dragSpec = spec as DragSpec

    const collectFn = collect as DragCollectFunction
    return (component: ReactComponent) => {
      const WrappedComponent = (props: Record<string, unknown>) => {
        const mockConnect: MockDragConnect = {
          dragSource: () => <T,>(el: T) => el,
          dragPreview: () => <T,>(el: T) => el,
        }
        const mockMonitor: MockDragMonitor = {
          isDragging: () => mockState.isDragging,
          getItem: () => mockState.dragItem,
          didDrop: () => mockState.didDrop,
        }
        const collectedProps = collectFn(mockConnect, mockMonitor)
        return mockReact.createElement(component, { ...props, ...collectedProps })
      }
      return WrappedComponent
    }
  }

  const dropTargetImpl = (_typeOrTypesFn: unknown, spec: unknown, collect: unknown) => {
    global.__dragDropSpecs.dropSpec = spec as DropSpec

    const collectFn = collect as DropCollectFunction
    return (component: ReactComponent) => {
      const WrappedComponent = (props: Record<string, unknown>) => {
        const mockConnect: MockDropConnect = {
          dropTarget: () => <T,>(el: T) => el,
        }
        const collectedProps = collectFn(mockConnect)
        return mockReact.createElement(component, { ...props, ...collectedProps })
      }
      return WrappedComponent
    }
  }

  dragSourceMock.mockImplementation(dragSourceImpl)
  dropTargetMock.mockImplementation(dropTargetImpl)

  return {
    DragSource: dragSourceMock,
    DropTarget: dropTargetMock,
  }
})

jest.mock('es-toolkit/compat', () => ({
  flowRight: <T,>(...fns: Array<(x: T) => T>) => (x: T) => fns.reduceRight((v, f) => f(v), x),
}))

import DragDropWrapper, {
  DragDropConnectorProps,
} from '../index'

const getDragSpec = (): DragSpec | undefined => {
  return global.__dragDropSpecs.dragSpec || undefined
}

const getDropSpec = (): DropSpec | undefined => {
  return global.__dragDropSpecs.dropSpec || undefined
}

const TestComponent: React.FC<DragDropConnectorProps & { testId?: string; label?: string }> = ({
  testId = 'test-component',
  label = 'Test Content',
  isDragging,
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
}) => {
  const element = (
    <div data-testid={testId} data-dragging={isDragging}>
      {label}
      <div data-testid="drag-source">{connectDragSource ? 'has-drag-source' : 'no-drag-source'}</div>
      <div data-testid="drag-preview">{connectDragPreview ? 'has-drag-preview' : 'no-drag-preview'}</div>
      <div data-testid="drop-target">{connectDropTarget ? 'has-drop-target' : 'no-drop-target'}</div>
    </div>
  )
  return connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(element)) : element
}

describe('DragDropWrapper', () => {
  const mockOnMove = jest.fn()
  const mockOnDragEnd = jest.fn()

  const defaultProps = {
    component: TestComponent,
    type: 'test-type',
    itemId: 'item-1',
    index: 0,
    onMove: mockOnMove,
  }

  beforeEach(() => {
    mockState.isDragging = false
    mockState.dragItem = null
    mockState.didDrop = false
    mockOnMove.mockClear()
    mockOnDragEnd.mockClear()
    document.body.style.cursor = ''
  })

  describe('rendering', () => {
    it('renders the wrapped component', () => {
      render(<DragDropWrapper {...defaultProps} />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('passes through custom props to wrapped component', () => {
      render(<DragDropWrapper {...defaultProps} testId="custom-id" label="Custom Label" />)
      expect(screen.getByTestId('custom-id')).toBeInTheDocument()
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })

    it('provides drag and drop connectors to wrapped component', () => {
      render(<DragDropWrapper {...defaultProps} />)
      expect(screen.getByTestId('drag-source')).toHaveTextContent('has-drag-source')
      expect(screen.getByTestId('drag-preview')).toHaveTextContent('has-drag-preview')
      expect(screen.getByTestId('drop-target')).toHaveTextContent('has-drop-target')
    })

    it('reflects isDragging state', () => {
      mockState.isDragging = true
      render(<DragDropWrapper {...defaultProps} />)
      expect(screen.getByTestId('test-component')).toHaveAttribute('data-dragging', 'true')
    })

    it('handles different item types', () => {
      render(<DragDropWrapper {...defaultProps} type="column" />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('handles numeric itemId', () => {
      render(<DragDropWrapper {...defaultProps} itemId={42} />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('handles string itemId', () => {
      render(<DragDropWrapper {...defaultProps} itemId="column-abc" />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('handles multiple wrapped components with different types', () => {
      render(
        <>
          <DragDropWrapper {...defaultProps} type="column" itemId="col-1" />
          <DragDropWrapper {...defaultProps} type="row" itemId="row-1" />
        </>,
      )

      expect(screen.getAllByTestId('test-component')).toHaveLength(2)
    })
  })

  describe('drag and drop configuration', () => {
    it('accepts onMove callback', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('accepts optional onDragEnd callback', () => {
      render(<DragDropWrapper {...defaultProps} onDragEnd={mockOnDragEnd} />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('accepts optional dragLabel prop', () => {
      render(<DragDropWrapper {...defaultProps} dragLabel="My Label" />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('works without onDragEnd callback', () => {
      expect(() => {
        render(<DragDropWrapper {...defaultProps} />)
      }).not.toThrow()
    })
  })

  describe('HOC integration', () => {
    it('applies both DragSource and DropTarget HOCs', () => {
      render(<DragDropWrapper {...defaultProps} />)

      expect(screen.getByTestId('drag-source')).toHaveTextContent('has-drag-source')
      expect(screen.getByTestId('drop-target')).toHaveTextContent('has-drop-target')
    })

    it('passes type prop correctly to HOCs', () => {
      const types = ['column', 'row', 'outcome', 'student']
      types.forEach((type) => {
        const { unmount } = render(<DragDropWrapper {...defaultProps} type={type} />)
        expect(screen.getByTestId('test-component')).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('prop forwarding', () => {
    it('forwards all props to wrapped component', () => {
      const customProps = {
        ...defaultProps,
        testId: 'custom',
        label: 'Custom',
        itemId: 'test-id',
        index: 5,
      }
      render(<DragDropWrapper {...customProps} />)
      expect(screen.getByTestId('custom')).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('handles extra props passed to wrapped component', () => {
      const { container } = render(
        <DragDropWrapper
          {...defaultProps}
          testId="with-extra"
          label="Extra Props"
          data-custom="test"
        />,
      )
      expect(screen.getByTestId('with-extra')).toBeInTheDocument()
      expect(container).toBeInTheDocument()
    })
  })

  describe('beginDrag behavior', () => {
    it('returns drag item with id, index, and originalIndex', () => {
      render(<DragDropWrapper {...defaultProps} itemId="item-1" index={3} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const dragItem = dragSpec?.beginDrag({ itemId: 'item-1', index: 3 })

      expect(dragItem).toEqual({
        id: 'item-1',
        index: 3,
        originalIndex: 3,
        label: undefined,
      })
    })

    it('includes dragLabel in drag item when provided', () => {
      render(<DragDropWrapper {...defaultProps} dragLabel="My Item" />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const dragItem = dragSpec?.beginDrag({ itemId: 'item-1', index: 0, dragLabel: 'My Item' })

      expect(dragItem).toEqual({
        id: 'item-1',
        index: 0,
        originalIndex: 0,
        label: 'My Item',
      })
    })

    it('handles numeric itemId', () => {
      render(<DragDropWrapper {...defaultProps} itemId={42} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const dragItem = dragSpec?.beginDrag({ itemId: 42, index: 0 })

      expect(dragItem).toEqual({
        id: 42,
        index: 0,
        originalIndex: 0,
        label: undefined,
      })
    })
  })

  describe('endDrag behavior', () => {
    it('calls onMove with original index when drop is cancelled', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const mockMonitor: MockDragMonitor = {
        isDragging: () => false,
        getItem: () => ({ id: 'item-1', index: 5, originalIndex: 2 }),
        didDrop: () => false,
      }

      dragSpec?.endDrag({ ...defaultProps, onMove: mockOnMove }, mockMonitor)

      expect(mockOnMove).toHaveBeenCalledWith('item-1', 2)
    })

    it('calls onDragEnd when drop is successful and callback is provided', () => {
      render(<DragDropWrapper {...defaultProps} onDragEnd={mockOnDragEnd} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const mockMonitor: MockDragMonitor = {
        isDragging: () => false,
        getItem: () => ({ id: 'item-1', index: 3, originalIndex: 2 }),
        didDrop: () => true,
      }

      dragSpec?.endDrag({ ...defaultProps, onDragEnd: mockOnDragEnd }, mockMonitor)

      expect(mockOnDragEnd).toHaveBeenCalled()
      expect(mockOnMove).not.toHaveBeenCalled()
    })

    it('does not call onDragEnd when drop is successful but callback not provided', () => {
      render(<DragDropWrapper {...defaultProps} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const mockMonitor: MockDragMonitor = {
        isDragging: () => false,
        getItem: () => ({ id: 'item-1', index: 3, originalIndex: 2 }),
        didDrop: () => true,
      }

      expect(() => {
        dragSpec?.endDrag(defaultProps, mockMonitor)
      }).not.toThrow()

      expect(mockOnMove).not.toHaveBeenCalled()
    })

    it('does not call onMove when drop is successful', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dragSpec = getDragSpec()
      expect(dragSpec).toBeDefined()

      const mockMonitor: MockDragMonitor = {
        isDragging: () => false,
        getItem: () => ({ id: 'item-1', index: 5, originalIndex: 2 }),
        didDrop: () => true,
      }

      dragSpec?.endDrag({ ...defaultProps, onMove: mockOnMove }, mockMonitor)

      expect(mockOnMove).not.toHaveBeenCalled()
    })
  })

  describe('hover behavior', () => {
    it('calls onMove when hovering over a different item', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dropSpec = getDropSpec()
      expect(dropSpec).toBeDefined()

      const mockMonitor: MockDropMonitor = {
        getItem: () => ({ id: 'item-1', index: 0 }),
      }

      dropSpec?.hover(
        { ...defaultProps, itemId: 'item-2', index: 3, onMove: mockOnMove },
        mockMonitor,
      )

      expect(mockOnMove).toHaveBeenCalledWith('item-1', 3)
    })

    it('updates drag item index after calling onMove', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dropSpec = getDropSpec()
      expect(dropSpec).toBeDefined()

      const dragItem = { id: 'item-1', index: 0 }
      const mockMonitor: MockDropMonitor = {
        getItem: () => dragItem,
      }

      dropSpec?.hover(
        { ...defaultProps, itemId: 'item-2', index: 5, onMove: mockOnMove },
        mockMonitor,
      )

      expect(dragItem.index).toBe(5)
    })

    it('does not call onMove when hovering over the same item', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dropSpec = getDropSpec()
      expect(dropSpec).toBeDefined()

      const mockMonitor: MockDropMonitor = {
        getItem: () => ({ id: 'item-1', index: 2 }),
      }

      dropSpec?.hover(
        { ...defaultProps, itemId: 'item-1', index: 2, onMove: mockOnMove },
        mockMonitor,
      )

      expect(mockOnMove).not.toHaveBeenCalled()
    })

    it('handles numeric itemId in hover', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dropSpec = getDropSpec()
      expect(dropSpec).toBeDefined()

      const mockMonitor: MockDropMonitor = {
        getItem: () => ({ id: 42, index: 0 }),
      }

      dropSpec?.hover({ ...defaultProps, itemId: 43, index: 1, onMove: mockOnMove }, mockMonitor)

      expect(mockOnMove).toHaveBeenCalledWith(42, 1)
    })

    it('handles mixed string and numeric itemIds', () => {
      render(<DragDropWrapper {...defaultProps} onMove={mockOnMove} />)
      const dropSpec = getDropSpec()
      expect(dropSpec).toBeDefined()

      const mockMonitor: MockDropMonitor = {
        getItem: () => ({ id: 'item-1', index: 0 }),
      }

      dropSpec?.hover({ ...defaultProps, itemId: 42, index: 2, onMove: mockOnMove }, mockMonitor)

      expect(mockOnMove).toHaveBeenCalledWith('item-1', 2)
    })
  })
})
