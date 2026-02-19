import React from 'react'
import {
  DragSource,
  DropTarget,
  DragSourceMonitor,
  DropTargetMonitor,
  ConnectDragSource,
  ConnectDragPreview,
  ConnectDropTarget,
} from 'react-dnd'
import { flowRight as compose } from 'es-toolkit/compat'

interface DragItem {
  id: string | number
  index: number
  originalIndex: number
  label?: string
}

export interface DragDropConnectorProps {
  connectDragSource?: ConnectDragSource
  connectDragPreview?: ConnectDragPreview
  connectDropTarget?: ConnectDropTarget
  isDragging?: boolean
}

interface DragDropWrapperConfig<T extends DragDropConnectorProps = DragDropConnectorProps> {
  component: React.ComponentType<T>
  type: string
  itemId: string | number
  index: number
  dragLabel?: string
  [key: string]: unknown
  onMove: (draggedId: string | number, hoverIndex: number) => void
  onDragEnd?: () => void
}

type DragDropWrapperComponentProps = DragDropWrapperConfig & DragDropConnectorProps

type DropTargetCollectedProps = Pick<DragDropConnectorProps, 'connectDropTarget'>
type DragSourceCollectedProps = Pick<DragDropConnectorProps, 'connectDragSource' | 'connectDragPreview' | 'isDragging'>

const DragDropWrapperComponent: React.FC<DragDropWrapperComponentProps> = ({
  component: Component,
  ...props
}) => {
  return <Component {...props} />
}

const dragSource = {
  beginDrag(props: DragDropWrapperComponentProps): DragItem {
    return {
      id: props.itemId,
      index: props.index,
      originalIndex: props.index,
      label: props.dragLabel,
    }
  },
  endDrag(props: DragDropWrapperComponentProps, monitor: DragSourceMonitor) {
    const dragItem = monitor.getItem() as DragItem

    if (!monitor.didDrop()) {
      props.onMove(dragItem.id, dragItem.originalIndex)
    } else if (props.onDragEnd) {
      props.onDragEnd()
    }
  },
}

const dropTarget = {
  hover(props: DragDropWrapperComponentProps, monitor: DropTargetMonitor) {
    const dragItem = monitor.getItem() as DragItem
    const hoverIndex = props.index

    if (dragItem.id !== props.itemId) {
      props.onMove(dragItem.id, hoverIndex)
      dragItem.index = hoverIndex
    }
  },
}

export default compose(
  DropTarget<DragDropWrapperComponentProps, DropTargetCollectedProps>(
    (props: DragDropWrapperComponentProps) => props.type,
    dropTarget,
    connect => ({
      connectDropTarget: connect.dropTarget(),
    }),
  ),
  DragSource<DragDropWrapperComponentProps, DragSourceCollectedProps, DragItem>(
    (props: DragDropWrapperComponentProps) => props.type,
    dragSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }),
  ),
)(DragDropWrapperComponent) as React.ComponentType<DragDropWrapperConfig>
