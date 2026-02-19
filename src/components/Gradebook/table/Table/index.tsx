import React, { useRef, useCallback } from 'react'
import { DragDropContext } from 'react-dnd'
import ReactDnDHTML5Backend from 'react-dnd-html5-backend'
import { Table as InstUITable, type TableProps as InstUITableProps } from '@instructure/ui-table'
import { View } from '@instructure/ui-view'
import { CustomDragLayer } from '@/components/Gradebook/dragdrop/CustomDragLayer'
import DragDropWrapper from '@/components/Gradebook/dragdrop/DragDropWrapper'
import { DragDropContainer } from '@/components/Gradebook/dragdrop/DragDropContainer'
import { Cell, CellProps } from '../Cell'
import { Row } from '../Row'
import { RowHeader } from '../RowHeader'
import { Header, HeaderProps } from '../ColumnHeader'

export type Column<TRow = Record<string, unknown>> = {
  key: string
  header: string | (() => React.ReactNode)
  render?: (cellData: unknown, rowData: TRow, focused?: boolean) => React.ReactNode
  width?: string | number
  isSticky?: boolean
  draggable?: boolean
  dragLabel?: string
  data?: TRow
  isRowHeader?: boolean
  cellProps?: CellProps
  colHeaderProps?: HeaderProps
}

interface DragDropConfig {
  type: string
  onMove: (draggedId: string | number, hoverIndex: number) => void
  onDragEnd?: () => void
  onDragLeave?: () => void
  enabled?: boolean
}

export type TableProps<TRow = Record<string, unknown>> = {
  id?: string
  caption?: string
  columns: Array<Column<TRow>>
  data: Array<TRow>
  renderAboveHeader?: (
    columns: Array<Column<TRow>>,
    handleKeyDown: (event: React.KeyboardEvent, rowIndex: number, colIndex: number) => void,
  ) => React.ReactNode
  dragDropConfig?: DragDropConfig
} & Omit<InstUITableProps, 'children' | 'data'>

export const TableComponent = <TRow extends Record<string, unknown> = Record<string, unknown>>({
  id,
  columns,
  data,
  caption,
  renderAboveHeader,
  dragDropConfig,
  ...tableProps
}: TableProps<TRow>) => {
  const tableRef = useRef<HTMLDivElement>(null)

  const getCellElement = useCallback((rowIndex: number, colIndex: number): HTMLElement | null => {
    if (!tableRef.current) return null
    let cellId: string
    if (rowIndex === -1) {
      cellId = `header-${colIndex}`
    } else {
      cellId = `cell-${rowIndex}-${colIndex}`
    }
    return tableRef.current.querySelector(`[data-cell-id="${cellId}"]`)
  }, [])

  const focusCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      const cell = getCellElement(rowIndex, colIndex)
      if (cell) {
        cell.focus()
      }
    },
    [getCellElement],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (event.target !== event.currentTarget) return

      const {key} = event
      let newRowIndex = rowIndex
      let newColIndex = colIndex

      switch (key) {
        case 'ArrowUp': {
          event.preventDefault()
          // Allow moving from data (0+) to header (-1) to above-header (-2)
          // Above-header row exists only if renderAboveHeader is provided
          const minRow = renderAboveHeader ? -2 : -1
          newRowIndex = Math.max(minRow, rowIndex - 1)
          break
        }
        case 'ArrowDown':
          event.preventDefault()
          // Allow moving from above-header (-2) to header (-1) to data rows (0+)
          newRowIndex = Math.min(data.length - 1, rowIndex + 1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          newColIndex = Math.max(0, colIndex - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          newColIndex = Math.min(columns.length - 1, colIndex + 1)
          break
        default:
          return
      }

      if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
        focusCell(newRowIndex, newColIndex)
      }
    },
    [data.length, columns.length, focusCell, renderAboveHeader],
  )

  const renderColHeader = useCallback(
    (col: Column<TRow>, colIndex: number, draggableIndex: number, dragDropConfig?: DragDropConfig) => {
      const colHeaderProps: HeaderProps = {
        id: col.key,
        width: col.width,
        isSticky: col.isSticky,
        'data-cell-id': `header-${colIndex}`,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, -1, colIndex),
        ...col.colHeaderProps,
      }

      const dragLabel = col.dragLabel || col.key

      return col.draggable && dragDropConfig ? (
        <DragDropWrapper
          key={col.key}
          component={Header}
          type={dragDropConfig.type}
          itemId={col.key}
          index={draggableIndex}
          dragLabel={dragLabel}
          onMove={dragDropConfig.onMove}
          onDragEnd={dragDropConfig.onDragEnd}
          {...colHeaderProps}
        >
          {typeof col.header === 'function' ? col.header() : col.header}
        </DragDropWrapper>
      ) : (
        <Header key={col.key} {...colHeaderProps}>
          {typeof col.header === 'function' ? col.header() : col.header}
        </Header>
      )
    },
    [handleKeyDown],
  )

  const renderHeader = () => {
    const isDragDropEnabled = dragDropConfig?.enabled

    if (isDragDropEnabled && dragDropConfig) {
      // Pre-compute draggable indices for all columns
      const draggableIndices = new Map<number, number>()
      let draggableCounter = 0
      columns.forEach((col, idx) => {
        if (col.draggable) {
          draggableIndices.set(idx, draggableCounter)
          draggableCounter++
        }
      })

      return (
        <InstUITable.Head>
          <>
            {renderAboveHeader && renderAboveHeader(columns, handleKeyDown)}
            <DragDropContainer type={dragDropConfig.type} onDragLeave={dragDropConfig.onDragLeave}>
              {connectDropTarget => (
                <Row
                  setRef={el => {
                    if (el instanceof HTMLElement) {
                      connectDropTarget(el as unknown as React.ReactElement)
                    }
                  }}
                >
                  {columns.map((col, colIndex) => {
                    const currentDraggableIndex = draggableIndices.get(colIndex) ?? 0
                    return renderColHeader(col, colIndex, currentDraggableIndex, dragDropConfig)
                  })}
                </Row>
              )}
            </DragDropContainer>
          </>
        </InstUITable.Head>
      )
    }

    return (
      <InstUITable.Head>
        <>
          {renderAboveHeader && renderAboveHeader(columns, handleKeyDown)}
          <Row>{columns.map((col, colIndex) => renderColHeader(col, colIndex, 0))}</Row>
        </>
      </InstUITable.Head>
    )
  }

  const renderBody = () => {
    return (
      <InstUITable.Body>
        {data.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {columns.map((col, colIndex) => {
              const props = {
                id: `${rowIndex}-${col.key}`,
                'data-cell-id': `cell-${rowIndex}-${colIndex}`,
                tabIndex: 0,
                onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, rowIndex, colIndex),
                isSticky: col.isSticky,
                ...col.cellProps,
              }

              if (col.isRowHeader) {
                return (
                  <RowHeader key={col.key} {...props}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                  </RowHeader>
                )
              }

              if (col.render) {
                return (
                  <Cell key={col.key} {...props}>
                    {(focused: boolean) => col.render!(row[col.key], row, focused)}
                  </Cell>
                )
              }

              return (
                <Cell key={col.key} {...props}>
                  {row[col.key] as React.ReactNode}
                </Cell>
              )
            })}
          </Row>
        ))}
      </InstUITable.Body>
    )
  }

  return (
    <>
      {dragDropConfig?.enabled && (
        <CustomDragLayer renderItem={item => item?.label || 'Dragging...'} />
      )}
      <View
        as="div"
        overflowX="auto"
        elementRef={(el: Element | null) => {
          if (el instanceof HTMLDivElement) {
            ;(tableRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }
        }}
      >
        <InstUITable id={id} caption={caption} {...tableProps}>
          {renderHeader()}
          {renderBody()}
        </InstUITable>
      </View>
    </>
  )
}

export const Table = DragDropContext(ReactDnDHTML5Backend)(
  TableComponent,
) as React.ComponentType<TableProps>
