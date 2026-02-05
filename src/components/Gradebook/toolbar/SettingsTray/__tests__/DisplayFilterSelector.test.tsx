import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {cleanup, render, screen, fireEvent} from '@testing-library/react'
import {DisplayFilter} from '@/util/Gradebook/constants'
import {DisplayFilterSelector, DisplayFilterSelectorProps} from '../DisplayFilterSelector'

describe('DisplayFilterSelector', () => {
  const defaultProps: DisplayFilterSelectorProps = {
    values: [],
    onChange: jest.fn(),
  }

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders checkbox group with correct name and description', () => {
    render(<DisplayFilterSelector {...defaultProps} />)
    expect(screen.getByText('Display')).toBeInTheDocument()
  })

  it('renders all checkbox options', () => {
    render(<DisplayFilterSelector {...defaultProps} />)
    expect(screen.getByLabelText('Unpublished Assignments')).toBeInTheDocument()
    expect(screen.getByLabelText('Students with no results')).toBeInTheDocument()
    expect(screen.getByLabelText('Avatars in student list')).toBeInTheDocument()
    expect(screen.getByLabelText('Outcomes with no results')).toBeInTheDocument()
  })

  it('renders checkboxes with correct values', () => {
    render(<DisplayFilterSelector {...defaultProps} />)
    const unpublishedCheckbox = screen.getByLabelText('Unpublished Assignments')
    const studentsCheckbox = screen.getByLabelText('Students with no results')
    const avatarsCheckbox = screen.getByLabelText('Avatars in student list')
    const outcomesCheckbox = screen.getByLabelText('Outcomes with no results')

    expect(unpublishedCheckbox).toHaveAttribute('value', DisplayFilter.SHOW_UNPUBLISHED_ASSIGNMENTS)
    expect(studentsCheckbox).toHaveAttribute('value', DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS)
    expect(avatarsCheckbox).toHaveAttribute('value', DisplayFilter.SHOW_STUDENT_AVATARS)
    expect(outcomesCheckbox).toHaveAttribute('value', DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS)
  })

  it('displays checkboxes as checked when values are provided', () => {
    const props = {
      ...defaultProps,
      values: [
        DisplayFilter.SHOW_UNPUBLISHED_ASSIGNMENTS,
        DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS,
        DisplayFilter.SHOW_STUDENT_AVATARS,
        DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS,
      ],
    }
    render(<DisplayFilterSelector {...props} />)

    expect(screen.getByLabelText('Unpublished Assignments')).toBeChecked()
    expect(screen.getByLabelText('Students with no results')).toBeChecked()
    expect(screen.getByLabelText('Avatars in student list')).toBeChecked()
    expect(screen.getByLabelText('Outcomes with no results')).toBeChecked()
  })

  it('displays checkboxes as unchecked when values are empty', () => {
    render(<DisplayFilterSelector {...defaultProps} />)

    expect(screen.getByLabelText('Unpublished Assignments')).not.toBeChecked()
    expect(screen.getByLabelText('Students with no results')).not.toBeChecked()
    expect(screen.getByLabelText('Avatars in student list')).not.toBeChecked()
    expect(screen.getByLabelText('Outcomes with no results')).not.toBeChecked()
  })

  it('calls onChange with updated values when checkbox is clicked', () => {
    const onChange = jest.fn()
    render(<DisplayFilterSelector {...defaultProps} onChange={onChange} />)

    const studentsCheckbox = screen.getByLabelText('Students with no results')
    fireEvent.click(studentsCheckbox)

    expect(onChange).toHaveBeenCalledWith([DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS])
  })

  it('calls onChange with multiple values when multiple checkboxes are selected', () => {
    const onChange = jest.fn()
    render(<DisplayFilterSelector {...defaultProps} onChange={onChange} />)

    const studentsCheckbox = screen.getByLabelText('Students with no results')
    const avatarsCheckbox = screen.getByLabelText('Avatars in student list')
    const outcomesCheckbox = screen.getByLabelText('Outcomes with no results')

    fireEvent.click(studentsCheckbox)
    fireEvent.click(avatarsCheckbox)
    fireEvent.click(outcomesCheckbox)

    expect(onChange).toHaveBeenCalledWith([DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS])
    expect(onChange).toHaveBeenCalledWith([
      DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS,
      DisplayFilter.SHOW_STUDENT_AVATARS,
    ])
    expect(onChange).toHaveBeenCalledWith([
      DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS,
      DisplayFilter.SHOW_STUDENT_AVATARS,
      DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS,
    ])
  })

  it('calls onChange with empty array when all checkboxes are unchecked', () => {
    const onChange = jest.fn()
    const props = {
      ...defaultProps,
      values: [DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS],
      onChange,
    }
    render(<DisplayFilterSelector {...props} />)

    const studentsCheckbox = screen.getByLabelText('Students with no results')
    fireEvent.click(studentsCheckbox)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('preserves other selected values when toggling one checkbox', () => {
    const onChange = jest.fn()
    const props = {
      ...defaultProps,
      values: [
        DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS,
        DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS,
      ],
      onChange,
    }
    render(<DisplayFilterSelector {...props} />)

    const avatarsCheckbox = screen.getByLabelText('Avatars in student list')
    fireEvent.click(avatarsCheckbox)

    expect(onChange).toHaveBeenCalledWith([
      DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS,
      DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS,
      DisplayFilter.SHOW_STUDENT_AVATARS,
    ])
  })

  it('can toggle unpublished assignments checkbox', () => {
    const onChange = jest.fn()
    render(<DisplayFilterSelector {...defaultProps} onChange={onChange} />)

    const unpublishedCheckbox = screen.getByLabelText('Unpublished Assignments')
    fireEvent.click(unpublishedCheckbox)

    expect(onChange).toHaveBeenCalledWith([DisplayFilter.SHOW_UNPUBLISHED_ASSIGNMENTS])
  })

  it('displays unpublished assignments checkbox as checked when value is provided', () => {
    const props = {
      ...defaultProps,
      values: [DisplayFilter.SHOW_UNPUBLISHED_ASSIGNMENTS],
    }
    render(<DisplayFilterSelector {...props} />)

    expect(screen.getByLabelText('Unpublished Assignments')).toBeChecked()
  })
})
