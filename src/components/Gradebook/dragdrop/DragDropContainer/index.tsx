import React, { useEffect, useRef } from 'react'
import { ConnectDropTarget, DropTarget, DropTargetMonitor } from 'react-dnd'

interface OwnProps {
  type: string
  children: (connectDropTarget: ConnectDropTarget) => React.ReactNode
  onDragLeave?: () => void
}

interface InjectedProps {
  connectDropTarget: ConnectDropTarget
  isOver: boolean
  canDrop: boolean
}

type Props = OwnProps & InjectedProps
type ComponentProps = Omit<Props, 'type'>

const Component: React.FC<ComponentProps> = ({
  children,
  onDragLeave,
  connectDropTarget,
  isOver,
  canDrop,
}) => {
  const prevIsOverRef = useRef<boolean>() // To prevent initial call (isOver is false initially)

  useEffect(() => {
    if (prevIsOverRef.current === true && isOver === false && canDrop) {
      onDragLeave?.()
    }
    prevIsOverRef.current = isOver
  }, [isOver, canDrop, onDragLeave])

  return <>{children(connectDropTarget)}</>
}

export const DragDropContainer = DropTarget(
  (props: Props) => props.type,
  {},
  (connect, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({shallow: false}),
    canDrop: monitor.canDrop(),
  }),
)(Component) as unknown as React.ComponentType<OwnProps>
