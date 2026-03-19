import React from 'react'
import { View, ViewProps } from '@instructure/ui-view'

export type RowHeaderProps = ViewProps & {
  children?: React.ReactNode
  isSticky?: boolean
  isStacked?: boolean
  'data-cell-id'?: string
  'data-row-index'?: number
  'data-col-key'?: string
}

export const RowHeader = React.memo(({
  children,
  isSticky,
  isStacked,
  'data-cell-id': dataCellId,
  ...props
}: RowHeaderProps) => {
  return (
    <View
      borderWidth="0 0 small 0"
      overflowX="auto"
      as={isStacked ? 'div' : 'th'}
      role={isStacked ? 'rowheader' : undefined}
      scope="row"
      position={isSticky ? 'sticky' : 'static'}
      stacking="topmost"
      insetInlineStart={isSticky ? '0' : undefined}
      background={isSticky && !props.background ? 'primary' : props.background}
      focusPosition="inset"
      data-cell-id={dataCellId}
      {...props}
    >
      {children}
    </View>
  )
})

RowHeader.displayName = 'RowHeader'
