import React from 'react'
import type { ConnectDropTarget } from 'react-dnd'
import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

let mockIsOver = false
let mockCanDrop = true

type MockConnectDropTarget = <T>(node: T) => T

interface MockDropConnect {
  dropTarget: () => MockConnectDropTarget
}

interface MockDropMonitor {
  isOver: () => boolean
  canDrop: () => boolean
}

type DropCollectFunction = (connect: MockDropConnect, monitor: MockDropMonitor) => Record<string, unknown>

type ReactComponent = React.ComponentType<Record<string, unknown>>

jest.mock('react-dnd', () => {
  const mockReact = jest.requireActual('react')

  return {
    DropTarget: jest.fn(
      (_typeOrTypesFn: unknown, _spec: unknown, collect: unknown) =>
        (component: ReactComponent) => {
          const WrappedComponent = (props: Record<string, unknown>) => {
            const mockConnect: MockDropConnect = {
              dropTarget: () => <T,>(el: T) => el,
            }
            const mockMonitor: MockDropMonitor = {
              isOver: () => mockIsOver,
              canDrop: () => mockCanDrop,
            }
            const collectedProps = (collect as DropCollectFunction)(mockConnect, mockMonitor)
            return mockReact.createElement(component, { ...props, ...collectedProps })
          }
          return WrappedComponent
        },
    ),
  }
})

import { DragDropContainer } from '../index'

describe('DragDropContainer', () => {
  const defaultProps = {
    type: 'test-type',
    children: (connectDropTarget: ConnectDropTarget) =>
      connectDropTarget(<div data-testid="drop-target">Drop Target Content</div>),
  }

  beforeEach(() => {
    mockIsOver = false
    mockCanDrop = true
    jest.clearAllMocks()
  })

  it('renders children content', () => {
    render(<DragDropContainer {...defaultProps} />)
    expect(screen.getByText('Drop Target Content')).toBeInTheDocument()
  })

  it('calls children function with connectDropTarget', () => {
    const childrenSpy = jest.fn().mockReturnValue(<div>Test</div>)
    render(<DragDropContainer type="test-type">{childrenSpy}</DragDropContainer>)
    expect(childrenSpy).toHaveBeenCalled()
    expect(typeof childrenSpy.mock.calls[0][0]).toBe('function')
  })

  it('does not call onDragLeave on initial render', () => {
    const onDragLeave = jest.fn()
    render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('does not call onDragLeave when isOver remains false', () => {
    const onDragLeave = jest.fn()
    mockIsOver = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('does not call onDragLeave when isOver changes from false to true', () => {
    const onDragLeave = jest.fn()
    mockIsOver = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('calls onDragLeave when isOver changes from true to false and canDrop is true', () => {
    const onDragLeave = jest.fn()
    mockIsOver = true
    mockCanDrop = true
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    expect(onDragLeave).not.toHaveBeenCalled()

    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(1)
  })

  it('does not call onDragLeave when isOver changes from true to false but canDrop is false', () => {
    const onDragLeave = jest.fn()
    mockIsOver = true
    mockCanDrop = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('handles multiple drag enter and leave cycles', () => {
    const onDragLeave = jest.fn()
    mockIsOver = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    // First enter
    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()

    // First leave
    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(1)

    // Second enter
    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(1)

    // Second leave
    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(2)
  })

  it('works without onDragLeave callback', () => {
    mockIsOver = true
    const { rerender } = render(<DragDropContainer {...defaultProps} />)

    expect(() => {
      mockIsOver = false
      rerender(<DragDropContainer {...defaultProps} />)
    }).not.toThrow()
  })

  it('does not call onDragLeave when isOver stays true', () => {
    const onDragLeave = jest.fn()
    mockIsOver = true
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('handles canDrop changing while not over', () => {
    const onDragLeave = jest.fn()
    mockIsOver = false
    mockCanDrop = true
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockCanDrop = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('handles canDrop changing from false to true while over', () => {
    const onDragLeave = jest.fn()
    mockIsOver = true
    mockCanDrop = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    mockCanDrop = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()
  })

  it('calls onDragLeave when leaving after canDrop is true', () => {
    const onDragLeave = jest.fn()
    mockIsOver = true
    mockCanDrop = true
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    // Stay over with canDrop true
    mockIsOver = true
    mockCanDrop = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()

    // Leave while canDrop is true
    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(1)
  })

  it('handles onDragLeave callback changing between renders', () => {
    const onDragLeave1 = jest.fn()
    const onDragLeave2 = jest.fn()
    mockIsOver = true
    const { rerender } = render(
      <DragDropContainer {...defaultProps} onDragLeave={onDragLeave1} />,
    )

    // Change the callback and trigger leave
    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave2} />)

    // Should call the new callback
    expect(onDragLeave1).not.toHaveBeenCalled()
    expect(onDragLeave2).toHaveBeenCalledTimes(1)
  })

  it('renders complex children correctly', () => {
    render(
      <DragDropContainer type="test-type">
        {(connectDropTarget: ConnectDropTarget) =>
          connectDropTarget(
            <div>
              <span>Complex</span>
              <div>Content</div>
            </div>,
          )
        }
      </DragDropContainer>,
    )
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('preserves prevIsOverRef state across multiple renders', () => {
    const onDragLeave = jest.fn()
    mockIsOver = false
    const { rerender } = render(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    // Enter
    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)

    // Stay over (should not trigger callback)
    mockIsOver = true
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).not.toHaveBeenCalled()

    // Leave (should trigger callback once)
    mockIsOver = false
    rerender(<DragDropContainer {...defaultProps} onDragLeave={onDragLeave} />)
    expect(onDragLeave).toHaveBeenCalledTimes(1)
  })

  it('accepts different drop types', () => {
    render(
      <DragDropContainer type="custom-type">
        {(connectDropTarget: ConnectDropTarget) =>
          connectDropTarget(<div>Custom Type Content</div>)
        }
      </DragDropContainer>,
    )
    expect(screen.getByText('Custom Type Content')).toBeInTheDocument()
  })

  it('renders multiple containers with different types', () => {
    render(
      <>
        <DragDropContainer type="type-1">
          {(connectDropTarget: ConnectDropTarget) =>
            connectDropTarget(<div>Container 1</div>)
          }
        </DragDropContainer>
        <DragDropContainer type="type-2">
          {(connectDropTarget: ConnectDropTarget) =>
            connectDropTarget(<div>Container 2</div>)
          }
        </DragDropContainer>
      </>,
    )
    expect(screen.getByText('Container 1')).toBeInTheDocument()
    expect(screen.getByText('Container 2')).toBeInTheDocument()
  })
})
