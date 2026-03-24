import React, { useEffect } from 'react'
import { View, ViewProps } from '@instructure/ui-view'
import { DragDropConnectorProps } from '@/components/Gradebook/dragdrop/DragDropWrapper'

export type ColumnHeaderProps = {
  children?: React.ReactNode
  isSticky?: boolean
  isStacked?: boolean
  'data-cell-id'?: string
  'data-testid'?: string
  'data-row-index'?: number
  'data-col-key'?: string
} & Partial<DragDropConnectorProps> &
  Omit<ViewProps, 'onDragLeave' | 'onDragEnd'>

// Custom comparison function to prevent re-renders when column order changes
// but individual column data hasn't changed
const arePropsEqual = (prevProps: ColumnHeaderProps, nextProps: ColumnHeaderProps): boolean => {
  // Check stable identifier
  if (prevProps.id !== nextProps.id) return false
  if (prevProps['data-cell-id'] !== nextProps['data-cell-id']) return false
  if (prevProps['data-col-key'] !== nextProps['data-col-key']) return false

  // Check visual props
  if (prevProps.width !== nextProps.width) return false
  if (prevProps.isSticky !== nextProps.isSticky) return false
  if (prevProps.isStacked !== nextProps.isStacked) return false

  // Check keyboard navigation
  if (prevProps.onKeyDown !== nextProps.onKeyDown) return false
  if (prevProps.tabIndex !== nextProps.tabIndex) return false

  // Check drag-drop state (these should be stable via useCallback)
  if (prevProps.connectDragSource !== nextProps.connectDragSource) return false
  if (prevProps.connectDragPreview !== nextProps.connectDragPreview) return false
  if (prevProps.connectDropTarget !== nextProps.connectDropTarget) return false
  if (prevProps.isDragging !== nextProps.isDragging) return false

  // onMove and onDragEnd should be stable (useCallback in stories/parent)
  // but we don't need to check them since they're filtered out before DOM

  // Compare children by reference - function children must be stabilized with useCallback
  // by the caller if re-renders should be avoided
  if (prevProps.children !== nextProps.children) return false

  return true
}

const ColumnHeaderComponent = ({
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

  const headerContentStyle = React.useMemo(
    () => ({
      opacity: isDragging ? 0.5 : 1,
      transition: 'opacity 0.15s ease-in-out',
      width: cleanViewProps.width,
      cursor: connectDragSource ? 'grab' : 'default'
    }),
    [isDragging, cleanViewProps.width, connectDragSource]
  )

  const elementRef = React.useCallback((ref: Element | null) => {
    if (connectDropTarget && ref instanceof HTMLElement) {
      connectDropTarget(ref as unknown as React.ReactElement)
    }
  }, [connectDropTarget])

  const headerContent = (
    <div
      style={headerContentStyle}
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
      elementRef={elementRef}
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

export const ColumnHeader = React.memo(ColumnHeaderComponent, arePropsEqual)

ColumnHeader.displayName = 'ColumnHeader'
