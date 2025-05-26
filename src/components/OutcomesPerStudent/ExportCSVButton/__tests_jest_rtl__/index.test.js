import React from 'react'
import { jest, expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import ExportCSVButton from '../index'
import { NOT_FETCHING } from '../../../../constants'

jest.mock('react-csv', () => ({
  CSVLink: ({ children, ...props }) => <a data-testid="csv-link" {...props}>
    {children}
    <div data-testid="csv-link-data">{JSON.stringify(props.data)}</div>
    <div data-testid="csv-link-headers">{JSON.stringify(props.headers)}</div>
  </a>
}))

expect.extend(toHaveNoViolations)

jest.mock('@instructure/ui-motion', (props) => {
  return {
    Transition: (props) => <div>{props.children}</div>
  }
})

describe('OutcomesPerStudent/ExportCSVButton', () => {

  const makeProps = (props) => {
    return {
      fetchCSVData: jest.fn(),
      formatCSVData: jest.fn(),
      fetchingStatus: NOT_FETCHING,
      artifactId: 1,
      ...props
    }
  }

  it('renders the export CSV button', () => {
    render(<ExportCSVButton {...makeProps({})} />)
    expect(screen.queryByText(/Export CSV/)).toBeInTheDocument()
  })

  it('export CSV button is enabled by default', () => {
    render(<ExportCSVButton {...makeProps({})} />)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('click export CSV calls fetchCSVData', () => {
    const props = makeProps({})
    render(<ExportCSVButton {...props} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(props.fetchCSVData).toHaveBeenCalledTimes(1)
  })

  it('starting export changes the export CSV button to cancel export', () => {
    const props = makeProps({})
    render(<ExportCSVButton {...props} />)
    const button = screen.getAllByRole('button').filter((b) => b.textContent === 'Export CSV')[0]
    fireEvent.click(button)
    expect(screen.getByText(/Cancel Export/)).toBeInTheDocument()
  })

  it('starting export displays the ProgressBar', () => {
    const props = makeProps({})
    render(<ExportCSVButton {...props} />)
    const button = screen.getAllByRole('button').filter((b) => b.textContent === 'Export CSV')[0]
    fireEvent.click(button)
    expect(screen.getByText(/Exporting/)).toBeInTheDocument()
  })

  it('correct headers are passed into CSVLink', () => {
    render(<ExportCSVButton {...makeProps({})} />)
    const headers = screen.getByTestId('csv-link-headers')
    expect(JSON.parse(headers.textContent).length).toEqual(10)
  })

  it('CSVLink is initially passed in no row data', () => {
    render(<ExportCSVButton {...makeProps({})} />)
    const rowData = screen.getByTestId('csv-link-data')
    expect(rowData.textContent).toEqual('[]')
  })

  it('CSVLink is not keyboard accessible', () => {
    render(<ExportCSVButton {...makeProps({})} />)
    const downloadLink = screen.getByTestId('csv-link')
    expect(downloadLink.getAttribute('tabindex')).toEqual('-1')
  })

  it('meets a11y standards', async () => {
    const { container } = render(<ExportCSVButton {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
