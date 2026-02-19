import React, { Children, isValidElement, useContext } from 'react'
import { View, ViewProps } from '@instructure/ui-view'
import { TableContext } from '@instructure/ui-table'
import { safeCloneElement } from '@instructure/ui-react-utils'

export type RowProps = Omit<ViewProps, 'onDragLeave' | 'onDragEnd'> & {
  children: React.ReactNode
  setRef?: (ref: HTMLElement | null) => void
}

export const Row: React.FC<RowProps> = ({children, setRef}) => {
  const context = useContext(TableContext)
  const isStacked = context.isStacked
  const headers = context.headers

  return (
    <View
      as={isStacked ? 'div' : 'tr'}
      role={isStacked ? 'row' : undefined}
      elementRef={setRef}
      // trick to ensure full height div in cell
      height={isStacked ? undefined : '1px'}
    >
      {Children.toArray(children)
        .filter(Boolean)
        .map((child, index) => {
          if (isValidElement(child)) {
            return safeCloneElement(child, {
              key: child.props.name,
              isStacked,
              header: headers && headers[index],
            })
          }
          return child
        })}
    </View>
  )
}
