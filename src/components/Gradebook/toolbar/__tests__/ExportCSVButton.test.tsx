import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import {ExportCSVButton} from '../ExportCSVButton'

describe('ExportCSVButton', () => {
  beforeEach(() => {
    // Suppress jsdom navigation errors from CSVLink clicks
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (!msg.toString().includes('Not implemented: navigation')) {
        console.warn(msg)
      }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function makeProps(props = {}) {
    return Object.assign(
      {
        csvFileName: 'test-export.csv',
        csvExportHandler: jest.fn(() => Promise.resolve([{name: 'Test', score: 100}])),
      },
      props
    )
  }

  it('renders the export button', () => {
    render(<ExportCSVButton {...makeProps()} />)
    expect(screen.getByTestId('export-button')).toBeInTheDocument()
  })

  it('displays "Export" text initially', () => {
    render(<ExportCSVButton {...makeProps()} />)
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('displays "Exporting" text when export is in progress', async () => {
    const slowHandler = jest.fn(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    )
    render(<ExportCSVButton {...makeProps({csvExportHandler: slowHandler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    expect(screen.getByText('Exporting')).toBeInTheDocument()

    // Wait for async operation to complete to prevent act warnings
    await waitFor(() => {
      expect(screen.getByText('Export')).toBeInTheDocument()
    })
  })

  it('calls csvExportHandler when button is clicked', async () => {
    const handler = jest.fn(() => Promise.resolve([]))
    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    expect(handler).toHaveBeenCalledTimes(1)

    // Wait for async operation to complete
    await waitFor(() => {
      expect(screen.getByText('Export')).toBeInTheDocument()
    })
  })

  it('disables button during export', async () => {
    const slowHandler = jest.fn(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    )
    render(<ExportCSVButton {...makeProps({csvExportHandler: slowHandler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    expect(button).toHaveAttribute('disabled')

    // Wait for async operation to complete
    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
    })
  })

  it('re-enables button after successful export', async () => {
    const handler = jest.fn(() => Promise.resolve([{name: 'Test'}]))
    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
      expect(button).toHaveTextContent('Export')
    })
  })

  it('renders CSVLink with correct filename', () => {
    render(<ExportCSVButton {...makeProps({csvFileName: 'custom-export.csv'})} />)
    const csvLink = screen.getByTestId('csv-link')
    expect(csvLink).toHaveAttribute('download', 'custom-export.csv')
  })

  it('uses default filename when not provided', () => {
    const props = makeProps()
    delete props.csvFileName
    render(<ExportCSVButton {...props} />)
    const csvLink = screen.getByTestId('csv-link')
    expect(csvLink).toHaveAttribute('download', 'gradebook-export.csv')
  })

  it('hides CSVLink from accessibility tree', () => {
    render(<ExportCSVButton {...makeProps()} />)
    const csvLink = screen.getByTestId('csv-link')
    expect(csvLink).toHaveAttribute('aria-hidden', 'true')
    expect(csvLink).toHaveAttribute('tabIndex', '-1')
  })

  it('renders export icon', () => {
    render(<ExportCSVButton {...makeProps()} />)
    const button = screen.getByTestId('export-button')
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('passes exportData to CSVLink after successful export', async () => {
    const mockData = [{Student: 'Alice', Score: 95}, {Student: 'Bob', Score: 87}]
    const handler = jest.fn(() => Promise.resolve(mockData))
    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    await waitFor(() => {
      const csvLink = screen.getByTestId('csv-link')
      expect(csvLink).toHaveAttribute('href')
    })
  })

  it('re-enables button after failed export', async () => {
    const handler = jest.fn(() => Promise.reject(new Error('Export failed')))
    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)

    const button = screen.getByTestId('export-button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
      expect(button).toHaveTextContent('Export')
    })
  })

  it('handles multiple export attempts correctly', async () => {
    const handler = jest.fn<() => Promise<object[]>>()
      .mockResolvedValueOnce([{name: 'First'}])
      .mockResolvedValueOnce([{name: 'Second'}])

    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)
    const button = screen.getByTestId('export-button')

    fireEvent.click(button)
    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
    })

    fireEvent.click(button)
    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
    })

    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('triggers CSV download on successful export', async () => {
    const handler = jest.fn(() => Promise.resolve([{data: 'test'}]))
    render(<ExportCSVButton {...makeProps({csvExportHandler: handler})} />)

    const button = screen.getByTestId('export-button')
    const csvLink = screen.getByTestId('csv-link')
    const spanElement = csvLink.querySelector('span')
    const clickSpy = jest.spyOn(spanElement!, 'click')

    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  it('displays inline style for hidden CSV link', () => {
    render(<ExportCSVButton {...makeProps()} />)
    const csvLink = screen.getByTestId('csv-link')
    expect(csvLink).toHaveStyle({display: 'none'})
  })

  it('maintains button state during rapid clicks', async () => {
    const slowHandler = jest.fn(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    )
    render(<ExportCSVButton {...makeProps({csvExportHandler: slowHandler})} />)

    const button = screen.getByTestId('export-button')

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
    })

    expect(slowHandler).toHaveBeenCalledTimes(1)
  })
})
