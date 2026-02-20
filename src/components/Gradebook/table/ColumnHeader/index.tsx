import React, { useEffect } from 'react'
import { View, ViewProps } from '@instructure/ui-view'
import { DragDropConnectorProps } from '@/components/Gradebook/dragdrop/DragDropWrapper'

export type ColumnHeaderProps = {
  children?: React.ReactNode
  isSticky?: boolean
  isStacked?: boolean
  'data-cell-id'?: string
  'data-testid'?: string
} & Partial<DragDropConnectorProps> &
  Omit<ViewProps, 'onDragLeave' | 'onDragEnd'>

export const ColumnHeader = ({
  children,
  isSticky,
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
  isDragging,
  isStacked,
  'data-cell-id': dataCellId,
  ...viewProps
}: ColumnHeaderProps) => {
  // Filter out drag-drop specific props that shouldn't be passed to DOM
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMove, onDragEnd, itemId, index, type, component, ...cleanViewProps } = viewProps as typeof viewProps & {
    onMove?: unknown
    onDragEnd?: unknown
    itemId?: unknown
    index?: unknown
    type?: unknown
    component?: unknown
  }

  // Use an empty image as the drag preview to prevent the browser from
  // screenshotting the table structure when dragging a <th> child
  useEffect(() => {
    if (connectDragPreview) {
      const emptyImage = new Image()
      emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
      connectDragPreview(emptyImage, {captureDraggingState: true})
    }
  }, [connectDragPreview])

  const headerContent = (
    <div
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.15s ease-in-out',
        width: cleanViewProps.width,
        cursor: connectDragSource ? 'grab' : 'default'
      }}
      data-testid="column-header-content"
    >
      {children}
    </div>
  )

  const content = (
    <View
      data-cell-id={dataCellId}
      as={isStacked ? 'div' : 'th'}
      scope="col"
      focusPosition="inset"
      elementRef={ref => {
        if (connectDropTarget && ref instanceof HTMLElement) {
          connectDropTarget(ref as unknown as React.ReactElement)
        }
      }}
      position={isSticky ? 'sticky' : 'static'}
      insetInlineStart={isSticky ? '0' : undefined}
      background={!cleanViewProps.background ? 'primary' : cleanViewProps.background}
      cursor={connectDragSource ? 'grab' : 'default'}
      stacking="above"
      {...cleanViewProps}
    >
      {connectDragSource ? connectDragSource(headerContent) : headerContent}
    </View>
  )

  return content
}
