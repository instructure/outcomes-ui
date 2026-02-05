import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {render, fireEvent} from '@testing-library/react'
import {SecondaryInfoDisplay} from '@/util/Gradebook/constants'
import {SecondaryInfoSelector, SecondaryInfoSelectorProps} from '../SecondaryInfoSelector'

describe('SecondaryInfoSelector', () => {
  const defaultProps: SecondaryInfoSelectorProps = {
    value: SecondaryInfoDisplay.NONE,
    onChange: jest.fn(),
  }

  it('renders all option items', () => {
    const {getByText} = render(<SecondaryInfoSelector {...defaultProps} />)
    expect(getByText('SIS ID')).toBeInTheDocument()
    expect(getByText('Integration ID')).toBeInTheDocument()
    expect(getByText('Login ID')).toBeInTheDocument()
    expect(getByText('None')).toBeInTheDocument()
  })

  it('calls onChange when an option is clicked', () => {
    const onChange = jest.fn()
    const {getByLabelText} = render(<SecondaryInfoSelector {...defaultProps} onChange={onChange} />)
    const sisIdInput = getByLabelText('SIS ID')
    fireEvent.click(sisIdInput)
    expect(onChange).toHaveBeenCalledWith(SecondaryInfoDisplay.SIS_ID)
  })
})
