import React, { useCallback, useMemo, useRef, useState } from 'react'
import { View, ViewProps } from '@instructure/ui-view'

export type CellProps = Omit<ViewProps, 'children'> & {
  id?: string
  width?: number | string
  boxShadow?: string
  isSticky?: boolean
  isStacked?: boolean
  header?: string | (() => React.ReactNode)
  children?: React.ReactNode | ((focused: boolean) => React.ReactNode)
  'data-cell-id'?: string
  'data-row-index'?: number
  'data-col-key'?: string
}

const CellComponent: React.FC<CellProps> = ({
  id,
  children,
  width,
  boxShadow,
  isSticky,
  isStacked,
  header,
  ...props
}: CellProps) => {
  const [focus, setFocus] = useState(false)
  const cellRef = useRef<HTMLElement | null>(null)

  const handleBlur = useCallback((event: React.FocusEvent) => {
    const relatedTarget = event.relatedTarget as Node
    if (relatedTarget && cellRef.current?.contains(relatedTarget)) {
      return
    }
    setFocus(false)
  }, [])

  const handleFocus = useCallback(() => setFocus(true), [])

  const elementRef = useCallback((el: Element | null) => {
    if (el instanceof HTMLElement) {
      cellRef.current = el
    }
  }, [])

  const themeOverride = useMemo(
    () => (_componentTheme: unknown, currentTheme: {colors: {contrasts: {grey1214: string}}}) => ({
      shadowAbove: boxShadow ?? `2px 0 0 0 ${currentTheme.colors.contrasts.grey1214}`,
    }),
    [boxShadow]
  )

  return (
    <View
      id={id}
      width={width}
      height="inherit"
      borderWidth="0 0 small 0"
      overflowX="auto"
      as={isStacked ? 'div' : 'td'}
      role={isStacked ? 'cell' : undefined}
      position={isSticky ? 'sticky' : 'static'}
      stacking="above"
      insetInlineStart={isSticky ? '0' : undefined}
      background={isSticky && !props.background ? 'primary' : props.background}
      focusPosition="inset"
      elementRef={elementRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      themeOverride={themeOverride}
      {...props}
    >
      {header ? (typeof header === 'function' ? header() : header) : null}
      {typeof children === 'function' ? children(focus) : children}
    </View>
  )
}

// Custom comparison function for React.memo
// We need to compare most props, but be smart about function props
const arePropsEqual = (prevProps: CellProps, nextProps: CellProps): boolean => {
  // If the id changed, definitely re-render
  if (prevProps.id !== nextProps.id) return false

  // Check data attributes that affect keyboard navigation
  if (prevProps['data-row-index'] !== nextProps['data-row-index']) return false
  if (prevProps['data-col-key'] !== nextProps['data-col-key']) return false
  if (prevProps['data-cell-id'] !== nextProps['data-cell-id']) return false

  // Check visual props
  if (prevProps.width !== nextProps.width) return false
  if (prevProps.boxShadow !== nextProps.boxShadow) return false
  if (prevProps.isSticky !== nextProps.isSticky) return false
  if (prevProps.isStacked !== nextProps.isStacked) return false

  // Check other props that could change
  if (prevProps.tabIndex !== nextProps.tabIndex) return false

  // onKeyDown should be stable (useCallback), but check just in case
  if (prevProps.onKeyDown !== nextProps.onKeyDown) return false

  // Compare children by reference - function children must be stabilized with useCallback
  // by the caller if re-renders should be avoided
  if (prevProps.children !== nextProps.children) return false

  // For function children, skip comparison - they're always new references but produce same output
  // when all other props are the same

  return true
}

export const Cell = React.memo(CellComponent, arePropsEqual)

Cell.displayName = 'Cell'

export default Cell
