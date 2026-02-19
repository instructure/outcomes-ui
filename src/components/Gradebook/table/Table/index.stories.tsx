import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@instructure/ui-text'
import { Button, IconButton } from '@instructure/ui-buttons'
import { Menu } from '@instructure/ui-menu'
import { IconMoreLine } from '@instructure/ui-icons'
import { Flex } from '@instructure/ui-flex'
import { Table, TableComponent } from '.'
import type { Column, TableProps } from '.'

interface SampleRow extends Record<string, unknown> {
  id: string
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
  score: number
}

const SampleTable = TableComponent as unknown as React.ComponentType<TableProps<SampleRow>>

const sampleData: SampleRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', age: 28, status: 'active', score: 95 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', age: 34, status: 'active', score: 87 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', age: 25, status: 'inactive', score: 72 },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', age: 31, status: 'active', score: 92 },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', age: 29, status: 'active', score: 88 },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona@example.com', age: 27, status: 'inactive', score: 78 },
  { id: '7', name: 'George Wilson', email: 'george@example.com', age: 42, status: 'active', score: 84 },
  { id: '8', name: 'Hannah Montana', email: 'hannah@example.com', age: 23, status: 'active', score: 90 },
]

const basicColumns: Column<SampleRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '200px',
    isRowHeader: true,
  },
  {
    key: 'email',
    header: 'Email',
    width: '200px',
  },
  {
    key: 'age',
    header: 'Age',
    width: '200px',
  },
  {
    key: 'status',
    header: 'Status',
    width: '200px',
    render: (cellData) => (
      <Text
        color={cellData === 'active' ? 'success' : 'danger'}
        weight="bold"
      >
        {cellData as string}
      </Text>
    ),
  },
  {
    key: 'score',
    header: 'Score',
    width: '200px',
    render: (cellData) => (
      <Text weight="bold" color={Number(cellData) >= 85 ? 'success' : 'primary'}>
        {cellData as number}
      </Text>
    ),
  },
]

const meta: Meta<typeof SampleTable> = {
  title: 'Gradebook/Table',
  component: SampleTable,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SampleTable>

export const Default: Story = {
  args: {
    caption: 'Basic Table',
    columns: basicColumns,
    data: sampleData,
  },
}

export const WithStickyFirstColumn: Story = {
  args: {
    caption: 'Table with Sticky First Column',
    columns: [
      {
        ...basicColumns[0],
        isSticky: true,
      },
      ...basicColumns.slice(1),
      {
        key: 'assignment1',
        header: 'Assignment 1',
        width: '200px',
        render: () => <Text>{Math.floor(Math.random() * 100)}</Text>,
      },
      {
        key: 'assignment2',
        header: 'Assignment 2',
        width: '200px',
        render: () => <Text>{Math.floor(Math.random() * 100)}</Text>,
      },
      {
        key: 'assignment3',
        header: 'Assignment 3',
        width: '200px',
        render: () => <Text>{Math.floor(Math.random() * 100)}</Text>,
      },
      {
        key: 'assignment4',
        header: 'Assignment 4',
        width: '200px',
        render: () => <Text>{Math.floor(Math.random() * 100)}</Text>,
      },
      {
        key: 'assignment5',
        header: 'Assignment 5',
        width: '200px',
        render: () => <Text>{Math.floor(Math.random() * 100)}</Text>,
      },
    ],
    data: sampleData,
  },
}

export const WithCustomHeaders: Story = {
  args: {
    caption: 'Table with Function Headers',
    columns: basicColumns.map((col, idx) => ({
      ...col,
      colHeaderProps: {
        padding: 'small',
        background: idx % 2 === 0 ? 'secondary' : 'primary',
      },
      header: () => (
        <Flex gap="small" justifyItems="center">
          <Text>{col.header as string}</Text>

          {idx > 0 && (
            <Menu
              placement="bottom"
              trigger={
                <IconButton
                  size="small"
                  withBorder={false}
                  withBackground={false}
                  screenReaderLabel={`Options for ${col.header as string} column`}
                >
                  <IconMoreLine />
                </IconButton>
              }
            >
              <Menu.Item>Option 1</Menu.Item>
              <Menu.Item>Option 2</Menu.Item>
            </Menu>
          )}
        </Flex>
      ),
    })),
    data: sampleData,
  },
}

export const WithCustomCell: Story = {
  args: {
    caption: 'Table with Custom Cell Props',
    columns: basicColumns.map((col, idx) => ({
      ...col,
      cellProps: {
        padding: 'x-small',
        textAlign: idx === 2 || idx === 4 ? 'center' : 'start',
      },
      render: col.key === 'age'
        ? (cellData) => (
          <input
            type="text"
            defaultValue={String(cellData)}
            style={{ width: '60%', padding: '4px', textAlign: 'center' }}
          />
        )
        : col.render,
    })),
    data: sampleData,
  },
}

export const WithDraggableColumns: Story = {
  parameters: {
    storyshots: { disable: true },
  },
  render: (args) => {
    const [columns, setColumns] = React.useState(
      basicColumns.map((col) => ({
        ...col,
        draggable: col.key !== 'name', // All columns except name are draggable
      }))
    )

    const handleMove = (draggedId: string | number, hoverIndex: number) => {
      setColumns((prevColumns) => {
        // Get only draggable columns
        const draggableColumns = prevColumns.filter((col) => col.draggable)
        const draggedIndex = draggableColumns.findIndex((col) => col.key === draggedId)

        // Don't update if invalid or same position
        if (draggedIndex === -1 || draggedIndex === hoverIndex) {
          return prevColumns
        }

        // Reorder within draggable columns
        const newDraggableColumns = [...draggableColumns]
        const [draggedColumn] = newDraggableColumns.splice(draggedIndex, 1)
        newDraggableColumns.splice(hoverIndex, 0, draggedColumn)

        // Reconstruct full columns array with non-draggable columns in place
        const nonDraggableColumns = prevColumns.filter((col) => !col.draggable)
        return [...nonDraggableColumns, ...newDraggableColumns]
      })
    }

    const handleDragEnd = () => {
      // eslint-disable-next-line no-console
      console.log('Drag ended - final column order:', columns.map((c) => c.key))
    }

    const DraggableTable = Table as unknown as React.ComponentType<TableProps<SampleRow>>

    return (
      <DraggableTable
        {...args}
        columns={columns}
        layout="fixed"
        dragDropConfig={{
          type: 'COLUMN',
          enabled: true,
          onMove: handleMove,
          onDragEnd: handleDragEnd,
        }}
      />
    )
  },
  args: {
    caption: 'Table with Draggable Columns (drag columns to reorder)',
    data: sampleData,
  },
}

export const WithAboveHeaderRow: Story = {
  args: {
    caption: 'Table with Above Header Row',
    columns: basicColumns,
    data: sampleData,
    renderAboveHeader: (columns) => (
      <tr>
        <th
          colSpan={columns.length}
          style={{
            textAlign: 'center',
            padding: '12px',
            background: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
            data-cell-id="above-header-0"
          >
            <Text size="large" weight="bold">
              Student Data Overview
            </Text>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small">Export</Button>
              <Button size="small">Filter</Button>
            </div>
          </div>
        </th>
      </tr>
    ),
  },
}
