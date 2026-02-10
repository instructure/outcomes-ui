import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import {NameDisplayFormatSelector, NameDisplayFormatSelectorProps} from '../NameDisplaySelector'
import {NameDisplayFormat} from '@/util/gradebook/constants'

describe('NameDisplayFormatSelector', () => {
  const defaultProps: NameDisplayFormatSelectorProps = {
    value: NameDisplayFormat.FIRST_LAST,
    onChange: jest.fn<(format: NameDisplayFormat) => void>(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the radio group with description', () => {
      render(<NameDisplayFormatSelector {...defaultProps} />)
      expect(screen.getByText('Name Display Format')).toBeInTheDocument()
    })

    it('renders all format options', () => {
      render(<NameDisplayFormatSelector {...defaultProps} />)
      expect(screen.getByLabelText('First Name Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name, First Name')).toBeInTheDocument()
    })

    it('renders radio inputs with correct values', () => {
      render(<NameDisplayFormatSelector {...defaultProps} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name')
      const lastFirstRadio = screen.getByLabelText('Last Name, First Name')

      expect(firstLastRadio).toHaveAttribute('value', NameDisplayFormat.FIRST_LAST)
      expect(lastFirstRadio).toHaveAttribute('value', NameDisplayFormat.LAST_FIRST)
    })
  })

  describe('Default Values', () => {
    it('defaults to FIRST_LAST when value is undefined', () => {
      render(<NameDisplayFormatSelector {...defaultProps} value={undefined} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name') as HTMLInputElement
      expect(firstLastRadio.checked).toBe(true)
    })

    it('checks FIRST_LAST radio when value is FIRST_LAST', () => {
      render(<NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.FIRST_LAST} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name') as HTMLInputElement
      expect(firstLastRadio.checked).toBe(true)
    })

    it('checks LAST_FIRST radio when value is LAST_FIRST', () => {
      render(<NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.LAST_FIRST} />)
      const lastFirstRadio = screen.getByLabelText('Last Name, First Name') as HTMLInputElement
      expect(lastFirstRadio.checked).toBe(true)
    })
  })

  describe('User Interactions', () => {
    it('calls onChange with FIRST_LAST when first option is clicked', () => {
      const onChange = jest.fn<(format: NameDisplayFormat) => void>()
      render(
        <NameDisplayFormatSelector
          {...defaultProps}
          value={NameDisplayFormat.LAST_FIRST}
          onChange={onChange}
        />
      )

      const firstLastRadio = screen.getByLabelText('First Name Last Name')
      fireEvent.click(firstLastRadio)

      expect(onChange).toHaveBeenCalledWith(NameDisplayFormat.FIRST_LAST)
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('calls onChange with LAST_FIRST when second option is clicked', () => {
      const onChange = jest.fn<(format: NameDisplayFormat) => void>()
      render(<NameDisplayFormatSelector {...defaultProps} onChange={onChange} />)

      const lastFirstRadio = screen.getByLabelText('Last Name, First Name')
      fireEvent.click(lastFirstRadio)

      expect(onChange).toHaveBeenCalledWith(NameDisplayFormat.LAST_FIRST)
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Display States', () => {
    it('shows FIRST_LAST as selected initially', () => {
      render(<NameDisplayFormatSelector {...defaultProps} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name') as HTMLInputElement
      const lastFirstRadio = screen.getByLabelText('Last Name, First Name') as HTMLInputElement

      expect(firstLastRadio.checked).toBe(true)
      expect(lastFirstRadio.checked).toBe(false)
    })

    it('shows LAST_FIRST as selected when value is LAST_FIRST', () => {
      render(<NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.LAST_FIRST} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name') as HTMLInputElement
      const lastFirstRadio = screen.getByLabelText('Last Name, First Name') as HTMLInputElement

      expect(firstLastRadio.checked).toBe(false)
      expect(lastFirstRadio.checked).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('renders both options regardless of selected value', () => {
      const {rerender} = render(
        <NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.FIRST_LAST} />
      )

      expect(screen.getByLabelText('First Name Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name, First Name')).toBeInTheDocument()

      rerender(
        <NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.LAST_FIRST} />
      )

      expect(screen.getByLabelText('First Name Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name, First Name')).toBeInTheDocument()
    })

    it('converts enum value to string for radio input', () => {
      render(<NameDisplayFormatSelector {...defaultProps} value={NameDisplayFormat.FIRST_LAST} />)
      const firstLastRadio = screen.getByLabelText('First Name Last Name') as HTMLInputElement

      // The component converts the enum to string via .toString()
      expect(firstLastRadio.value).toBe(NameDisplayFormat.FIRST_LAST.toString())
    })
  })
})
