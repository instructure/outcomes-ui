import React from 'react'
import DragLayer from 'react-dnd/lib/DragLayer'
import { DragLayerMonitor } from 'react-dnd'
import { View } from '@instructure/ui-view'
import { CELL_HEIGHT, COLUMN_WIDTH } from '@/util/gradebook/constants'

interface DragItem {
  id: string | number
  index: number
  originalIndex: number
  label?: string
}

interface CustomDragLayerProps {
  renderItem?: (item: DragItem) => React.ReactNode
}

interface CollectedProps {
  item: DragItem | null
  currentOffset: {x: number; y: number} | null
  isDragging: boolean
}

const getItemStyles = (currentOffset: {x: number; y: number} | null) => {
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }

  const {x, y} = currentOffset
  const transform = `translate(${x}px, ${y}px)`

  return {
    transform,
    WebkitTransform: transform,
    width: COLUMN_WIDTH,
    height: CELL_HEIGHT,
  }
}

const CustomDragLayerComponent: React.FC<CustomDragLayerProps & CollectedProps> = ({
  renderItem,
  item,
  isDragging,
  currentOffset,
}) => {
  if (!isDragging) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <div style={getItemStyles(currentOffset)}>
        <View
          as="div"
          padding="x-small"
          background="secondary"
          shadow="resting"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          {renderItem && item ? renderItem(item) : item?.label || 'Dragging...'}
        </View>
      </div>
    </div>
  )
}

export const CustomDragLayer = DragLayer<CustomDragLayerProps, CollectedProps>(
  (monitor: DragLayerMonitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }),
)(CustomDragLayerComponent)
