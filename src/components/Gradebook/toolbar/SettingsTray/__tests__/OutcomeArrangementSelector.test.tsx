import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import {
  OutcomeArrangementSelector,
  OutcomeArrangementSelectorProps,
} from '../OutcomeArrangementSelector'
import {OutcomeArrangement} from '@/util/Gradebook/constants'

describe('OutcomeArrangementSelector', () => {
  const defaultProps: OutcomeArrangementSelectorProps = {
    value: OutcomeArrangement.UPLOAD_ORDER,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the dropdown with label', () => {
    render(<OutcomeArrangementSelector {...defaultProps} />)
    expect(screen.getByText('Arrange Outcomes by')).toBeInTheDocument()
  })

  it('renders the helper text', () => {
    render(<OutcomeArrangementSelector {...defaultProps} />)
    expect(screen.getByText('(You may drag & drop columns to re-arrange)')).toBeInTheDocument()
  })

  it('displays the selected value', () => {
    render(<OutcomeArrangementSelector {...defaultProps} value={OutcomeArrangement.ALPHABETICAL} />)
    expect(screen.getByDisplayValue('Alphabetical')).toBeInTheDocument()
  })

  it('calls onChange when an option is selected', async () => {
    const onChange = jest.fn()
    render(<OutcomeArrangementSelector {...defaultProps} onChange={onChange} />)

    const select = screen.getByLabelText('Arrange Outcomes by')
    fireEvent.click(select)

    const alphabeticalOption = await screen.findByText('Alphabetical')
    fireEvent.click(alphabeticalOption)

    expect(onChange).toHaveBeenCalledWith(OutcomeArrangement.ALPHABETICAL)
  })

  it('defaults to UPLOAD_ORDER when value is undefined', () => {
    render(<OutcomeArrangementSelector {...defaultProps} value={undefined} />)
    expect(screen.getByDisplayValue('Upload Order')).toBeInTheDocument()
  })

  it('displays CUSTOM when value is CUSTOM', () => {
    render(<OutcomeArrangementSelector {...defaultProps} value={OutcomeArrangement.CUSTOM} />)
    expect(screen.getByDisplayValue('Custom')).toBeInTheDocument()
  })

  it('displays UPLOAD_ORDER when value is UPLOAD_ORDER', () => {
    render(<OutcomeArrangementSelector {...defaultProps} value={OutcomeArrangement.UPLOAD_ORDER} />)
    expect(screen.getByDisplayValue('Upload Order')).toBeInTheDocument()
  })
})
