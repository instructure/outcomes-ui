import React, { useRef, useCallback, useEffect } from 'react'
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
import { ColumnHeader, ColumnHeaderProps } from '../ColumnHeader'

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
  colHeaderProps?: ColumnHeaderProps
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
    handleKeyDown: (event: React.KeyboardEvent) => void,
  ) => React.ReactNode
  dragDropConfig?: DragDropConfig
} & Omit<InstUITableProps, 'children' | 'data'>

// DataCell keeps the Cell child arrow function out of the hot render
// path. React.memo compares colRender/rowData/cellData by reference; when columns are
// reordered those values don't change, so Cell never receives new props and skips render.
type DataCellProps = Omit<CellProps, 'children'> & {
  colRender: (cellData: unknown, rowData: unknown, focused?: boolean) => React.ReactNode
  rowData: unknown
  cellData: unknown
}

const DataCellInner = ({ colRender, rowData, cellData, ...cellProps }: DataCellProps) => (
  <Cell {...cellProps}>
    {(focused: boolean) => colRender(cellData, rowData, focused)}
  </Cell>
)

const DataCell = React.memo(DataCellInner)

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
  const columnsRef = useRef(columns)

  // Keep columnsRef in sync with latest columns
  useEffect(() => {
    columnsRef.current = columns
  }, [columns])

  const getCellElement = useCallback((rowIndex: number, colKey: string): HTMLElement | null => {
    if (!tableRef.current) return null
    const selector = `[data-row-index="${rowIndex}"][data-col-key="${colKey}"]`
    return tableRef.current.querySelector(selector)
  }, [])

  const focusCell = useCallback(
    (rowIndex: number, colKey: string) => {
      const cell = getCellElement(rowIndex, colKey)
      if (cell) {
        if (rowIndex === -1) {
          const focusable = cell.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          if (focusable) {
            focusable.focus()
            return
          }
        }
        cell.focus()
      }
    },
    [getCellElement],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Allow arrow key navigation from the cell itself or from buttons within the cell
      // (e.g., header options menu), but prevent navigation from other interactive elements
      // (e.g., chart components that have their own keyboard navigation)
      if (event.target !== event.currentTarget) {
        const target = event.target as HTMLElement
        const isButton = target.tagName === 'BUTTON' || target.getAttribute('role') === 'button'
        if (!isButton) {
          return
        }
      }

      const target = event.currentTarget as HTMLElement
      const rowIndex = parseInt(target.dataset.rowIndex || '0', 10)
      const colKey = target.dataset.colKey || ''

      const {key} = event
      let newRowIndex = rowIndex
      let newColKey = colKey

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
        case 'ArrowLeft': {
          event.preventDefault()
          const currentColIndex = columnsRef.current.findIndex(col => col.key === colKey)
          const newColIndex = Math.max(0, currentColIndex - 1)
          newColKey = columnsRef.current[newColIndex]?.key || colKey
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          const currentColIndex = columnsRef.current.findIndex(col => col.key === colKey)
          const newColIndex = Math.min(columnsRef.current.length - 1, currentColIndex + 1)
          newColKey = columnsRef.current[newColIndex]?.key || colKey
          break
        }
        default:
          return
      }

      if (newRowIndex !== rowIndex || newColKey !== colKey) {
        focusCell(newRowIndex, newColKey)
      }
    },
    [data.length, focusCell, renderAboveHeader],
  )

  const renderColHeader = useCallback(
    (col: Column<TRow>, colIndex: number, draggableIndex: number, dragDropConfig?: DragDropConfig) => {
      const colHeaderProps: ColumnHeaderProps = {
        id: col.key,
        width: col.width,
        isSticky: col.isSticky,
        'data-cell-id': `header-${col.key}`,
        'data-row-index': -1,
        'data-col-key': col.key,
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        ...col.colHeaderProps,
      }

      const dragLabel = col.dragLabel || col.key

      return col.draggable && dragDropConfig ? (
        <DragDropWrapper
          key={col.key}
          component={ColumnHeader}
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
        <ColumnHeader key={col.key} {...colHeaderProps}>
          {typeof col.header === 'function' ? col.header() : col.header}
        </ColumnHeader>
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
            {columns.map((col) => {
              const props = {
                id: `${rowIndex}-${col.key}`,
                'data-cell-id': `cell-${rowIndex}-${col.key}`,
                'data-row-index': rowIndex,
                'data-col-key': col.key,
                tabIndex: 0,
                onKeyDown: handleKeyDown,
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
                  <DataCell
                    key={col.key}
                    colRender={col.render as DataCellProps['colRender']}
                    rowData={row}
                    cellData={row[col.key]}
                    {...props}
                  />
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
        padding="none none small none"
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
