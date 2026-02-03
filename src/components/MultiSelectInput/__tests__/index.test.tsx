import React from 'react'
import {expect, jest} from '@jest/globals'
import '@testing-library/jest-dom'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import MultiSelectInput from '../index'

import * as FlashAlert from '@components/FlashAlert'

jest.mock('@components/FlashAlert')

describe('MultiSelectInput', () => {
  const mockOptions = [
    {id: '1', value: '1', text: 'Option 1'},
    {id: '2', value: '2', text: 'Option 2'},
    {id: '3', value: '3', text: 'Option 3'},
    {id: '4', value: '4', text: 'Option 4'},
  ]

  const mockGroupedOptions = [
    {id: '1', value: '1', text: 'Math', group: 'STEM'},
    {id: '2', value: '2', text: 'Physics', group: 'STEM'},
    {id: '3', value: '3', text: 'History', group: 'Arts'},
    {id: '4', value: '4', text: 'English', group: 'Arts'},
  ]

  function makeProps(props = {}) {
    return {
      label: 'Test Label',
      onChange: jest.fn(),
      children: mockOptions.map(o => (
        <MultiSelectInput.Option id={o.id} key={o.id} value={o.value}>
          {o.text}
        </MultiSelectInput.Option>
      )),
      ...props,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (!msg.toString().includes('was not wrapped in act')) {
        console.warn(msg)
      }
    })
  })

  describe('Basic Rendering', () => {
    it('renders with label', () => {
      render(<MultiSelectInput {...makeProps()} />)
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('renders disabled state', () => {
      render(<MultiSelectInput {...makeProps({disabled: true})} />)
      const input = screen.getByTestId('multi-select-input')
      expect(input).toBeDisabled()
    })

    it('renders with placeholder', () => {
      render(<MultiSelectInput {...makeProps({placeholder: 'Select options...'})} />)
      const input = screen.getByTestId('multi-select-input')
      expect(input).toHaveAttribute('placeholder', 'Select options...')
    })

    it('renders required state when no options selected', () => {
      render(<MultiSelectInput {...makeProps({isRequired: true})} />)
      const input = screen.getByTestId('multi-select-input')
      expect(input).toBeRequired()
    })

    it('does not render required when options are selected', () => {
      render(<MultiSelectInput {...makeProps({isRequired: true, selectedOptionIds: ['1']})} />)
      const input = screen.getByTestId('multi-select-input')
      expect(input).not.toBeRequired()
    })
  })

  describe('Uncontrolled Mode', () => {
    it('allows selecting options', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({onChange})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      const option1 = screen.getByText('Option 1')
      fireEvent.click(option1)

      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('allows selecting multiple options', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({onChange})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      const option1 = screen.getByText('Option 1')
      fireEvent.click(option1)

      fireEvent.click(input)
      const option2 = screen.getByText('Option 2')
      fireEvent.click(option2)

      expect(onChange).toHaveBeenCalledWith(['1', '2'])
    })

    it('filters options based on input', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'Option 1'}})

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    })

    it('shows all options when filter is cleared', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'Option 1'}})
      fireEvent.change(input, {target: {value: ''}})

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('Controlled Mode', () => {
    it('works with controlled inputValue', () => {
      const onInputChange = jest.fn()
      const {rerender} = render(
        <MultiSelectInput
          {...makeProps({inputValue: '', customOnInputChange: onInputChange})}
        />,
      )

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'test'}})

      expect(onInputChange).toHaveBeenCalledWith('test')

      rerender(
        <MultiSelectInput
          {...makeProps({inputValue: 'test', customOnInputChange: onInputChange})}
        />,
      )
      expect(input).toHaveValue('test')
    })

    it('works with controlled selectedOptionIds', () => {
      const onChange = jest.fn()
      render(
        <MultiSelectInput {...makeProps({selectedOptionIds: ['1', '2'], onChange})} />,
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('Tag Management', () => {
    it('renders tags for selected options', () => {
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1', '2']})} />)

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('uses tagText prop when provided', () => {
      const children = [
        <MultiSelectInput.Option id="1" key="1" value="1" tagText="Custom Tag">
          Option 1
        </MultiSelectInput.Option>,
      ]
      render(<MultiSelectInput {...makeProps({children, selectedOptionIds: ['1']})} />)

      expect(screen.getByText('Custom Tag')).toBeInTheDocument()
    })

    it('dismisses tag on click', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1'], onChange})} />)

      const tagButton = screen.getByRole('button', {name: /Option 1/i})
      fireEvent.click(tagButton)

      expect(onChange).toHaveBeenCalledWith([])
    })

    it('removes last tag on backspace when input is empty', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1', '2'], onChange})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      fireEvent.keyDown(input, {key: 'Backspace'})

      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('does not remove tag on backspace when input has value', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1'], inputValue: 'test'})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      fireEvent.keyDown(input, {key: 'Backspace'})

      expect(onChange).not.toHaveBeenCalled()
    })

    it('focuses input after dismissing tag', () => {
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1']})} />)

      const tagButton = screen.getByRole('button', {name: /Option 1/i})
      fireEvent.click(tagButton)

      const input = screen.getByTestId('multi-select-input')
      expect(input).toHaveFocus()
    })
  })

  describe('Groups', () => {
    it('renders grouped options', () => {
      const children = mockGroupedOptions.map(o => (
        <MultiSelectInput.Option id={o.id} key={o.id} value={o.value} group={o.group}>
          {o.text}
        </MultiSelectInput.Option>
      ))
      render(<MultiSelectInput {...makeProps({children})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      expect(screen.getByText('STEM')).toBeInTheDocument()
      expect(screen.getByText('Arts')).toBeInTheDocument()
    })

    it('renders groupless options alongside groups', () => {
      const children = [
        <MultiSelectInput.Option id="1" key="1" value="1" group="STEM">
          Math
        </MultiSelectInput.Option>,
        <MultiSelectInput.Option id="2" key="2" value="2">
          Ungrouped
        </MultiSelectInput.Option>,
      ]
      render(<MultiSelectInput {...makeProps({children})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      expect(screen.getByText('STEM')).toBeInTheDocument()
      expect(screen.getByText('Ungrouped')).toBeInTheDocument()
    })
  })

  describe('Custom Callbacks', () => {
    it('calls customOnInputChange', () => {
      const customOnInputChange = jest.fn()
      render(<MultiSelectInput {...makeProps({customOnInputChange})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'test'}})

      expect(customOnInputChange).toHaveBeenCalledWith('test')
    })

    it('calls customOnRequestShowOptions', () => {
      const customOnRequestShowOptions = jest.fn()
      render(<MultiSelectInput {...makeProps({customOnRequestShowOptions})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      expect(customOnRequestShowOptions).toHaveBeenCalled()
    })

    it('calls customOnRequestHideOptions', () => {
      const customOnRequestHideOptions = jest.fn()
      render(<MultiSelectInput {...makeProps({customOnRequestHideOptions})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      fireEvent.blur(input)

      expect(customOnRequestHideOptions).toHaveBeenCalled()
    })

    it('calls customOnRequestSelectOption', () => {
      const customOnRequestSelectOption = jest.fn()
      render(<MultiSelectInput {...makeProps({customOnRequestSelectOption})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      const option1 = screen.getByText('Option 1')
      fireEvent.click(option1)

      expect(customOnRequestSelectOption).toHaveBeenCalledWith(['1'])
    })

    it('calls customOnBlur', () => {
      const customOnBlur = jest.fn()
      render(<MultiSelectInput {...makeProps({customOnBlur})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      fireEvent.blur(input)

      expect(customOnBlur).toHaveBeenCalled()
    })

    it('calls onUpdateHighlightedOption', () => {
      const onUpdateHighlightedOption = jest.fn()
      render(<MultiSelectInput {...makeProps({onUpdateHighlightedOption})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      const option1 = screen.getByText('Option 1')
      fireEvent.mouseOver(option1)

      expect(onUpdateHighlightedOption).toHaveBeenCalled()
    })
  })

  describe('Custom Matcher', () => {
    it('uses customMatcher when provided', () => {
      const customMatcher = jest.fn((option: {label?: React.ReactNode}, term: string) =>
        option.label?.toString().includes(term),)
      render(<MultiSelectInput {...makeProps({customMatcher})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'tion 2'}})

      expect(customMatcher).toHaveBeenCalled()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('uses default matcher when customMatcher not provided', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'Option'}})

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('Custom Render Before Input', () => {
    it('uses customRenderBeforeInput when provided', () => {
      const customRenderBeforeInput = jest.fn((tags: React.ReactNode) => (
        <div data-testid="custom-render">{tags}</div>
      ))
      render(
        <MultiSelectInput
          {...makeProps({customRenderBeforeInput, selectedOptionIds: ['1']})}
        />,
      )

      expect(customRenderBeforeInput).toHaveBeenCalled()
      expect(screen.getByTestId('custom-render')).toBeInTheDocument()
    })
  })

  describe('No Options', () => {
    it('shows custom noOptionsLabel when no matches', () => {
      render(<MultiSelectInput {...makeProps({noOptionsLabel: 'No matches found'})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'xyz'}})

      expect(screen.getByText('No matches found')).toBeInTheDocument()
    })

    it('shows default noOptionsLabel when no matches and no custom label', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'xyz'}})

      expect(screen.getByText('---')).toBeInTheDocument()
    })

    it('shows spinner when isLoading is true', () => {
      render(<MultiSelectInput {...makeProps({isLoading: true})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'xyz'}})

      expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    it('shows flash alert for no results after debounce', () => {
      jest.useFakeTimers()
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'xyz'}})

      jest.advanceTimersByTime(500)

      expect(FlashAlert.showFlashAlert).toHaveBeenCalledWith({
        message: 'No result found',
        type: 'info',
        timeout: 3000,
      })

      jest.useRealTimers()
    })

    it('cancels flash alert if user continues typing', () => {
      jest.useFakeTimers()
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'xyz'}})

      jest.advanceTimersByTime(300)
      fireEvent.change(input, {target: {value: 'a'}})

      jest.advanceTimersByTime(500)

      // Should only be called once for the final search
      expect(FlashAlert.showFlashAlert).toHaveBeenCalledTimes(1)

      jest.useRealTimers()
    })
  })

  describe('Input Refs', () => {
    it('calls setInputRef with input reference', () => {
      const setInputRef = jest.fn()
      render(<MultiSelectInput {...makeProps({setInputRef})} />)

      expect(setInputRef).toHaveBeenCalled()
    })

    it('calls inputRef prop with input element', () => {
      const inputRef = jest.fn()
      render(<MultiSelectInput {...makeProps({inputRef})} />)

      expect(inputRef).toHaveBeenCalled()
    })
  })

  describe('Live Region', () => {
    beforeEach(() => {
      // Clear existing live region if any
      const existingDiv = document.getElementById('flash_screenreader_holder')
      if (existingDiv) {
        existingDiv.remove()
      }
    })

    afterAll(() => {
      // Clean up live region after tests
      const existingDiv = document.getElementById('flash_screenreader_holder')
      if (existingDiv) {
        existingDiv.remove()
      }
    })

    it('creates live region if not exists', () => {
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1']})} />)

      // Trigger an action that creates the live region
      const tagButton = screen.getByRole('button', {name: /Option 1/i})
      fireEvent.click(tagButton)

      const liveRegion = document.getElementById('flash_screenreader_holder')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('role', 'alert')
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive')
    })

    it('uses existing live region if already exists', () => {
      const existingDiv = document.createElement('div')
      existingDiv.id = 'flash_screenreader_holder'
      existingDiv.setAttribute('role', 'alert')
      existingDiv.setAttribute('aria-live', 'assertive')
      existingDiv.setAttribute('aria-atomic', 'false')
      existingDiv.setAttribute('aria-relevant', 'additions text')
      existingDiv.className = 'screenreader-only'
      document.body.appendChild(existingDiv)

      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1']})} />)

      // Trigger an action that would use the live region
      const tagButton = screen.getByRole('button', {name: /Option 1/i})
      fireEvent.click(tagButton)

      // Should not create duplicate live regions
      const liveRegions = document.querySelectorAll('#flash_screenreader_holder')
      expect(liveRegions.length).toBe(1)
      expect(existingDiv).toBeInTheDocument()
    })
  })

  describe('Announcements', () => {
    it('announces when tag is removed', () => {
      render(<MultiSelectInput {...makeProps({selectedOptionIds: ['1']})} />)

      const tagButton = screen.getByRole('button', {name: /Option 1/i})
      fireEvent.click(tagButton)

      waitFor(() => {
        expect(screen.getByText('Option 1 removed.')).toBeInTheDocument()
      })
    })

    it('announces when option is selected', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)
      const option1 = screen.getByText('Option 1')
      fireEvent.click(option1)

      waitFor(() => {
        expect(screen.getByText('Option 1 selected. List collapsed.')).toBeInTheDocument()
      })
    })

    it('announces filtered options count', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'Option 1'}})

      waitFor(() => {
        expect(screen.getByText(/One option available/)).toBeInTheDocument()
      })
    })

    it('announces multiple filtered options', () => {
      render(<MultiSelectInput {...makeProps()} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.change(input, {target: {value: 'Option'}})

      waitFor(() => {
        expect(screen.getByText(/4 options available/)).toBeInTheDocument()
      })
    })

    it('handles delayed announcement when selecting option', () => {
      jest.useFakeTimers()
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({onChange})} />)

      const input = screen.getByTestId('multi-select-input')
      fireEvent.click(input)

      const option1 = screen.getByText('Option 1')
      fireEvent.click(option1)

      // Advance timers to trigger the delayed announcement
      jest.advanceTimersByTime(100)

      expect(onChange).toHaveBeenCalledWith(['1'])

      jest.useRealTimers()
    })
  })

  describe('Edge Cases', () => {
    it('handles non-array children', () => {
      const children = (
        <MultiSelectInput.Option id="1" value="1">
          Option 1
        </MultiSelectInput.Option>
      )
      expect(() => {
        render(<MultiSelectInput {...makeProps({children})} />)
      }).not.toThrow()
    })

    it('handles null children', () => {
      const children = [
        <MultiSelectInput.Option id="1" key="1" value="1">
          Option 1
        </MultiSelectInput.Option>,
        null,
        <MultiSelectInput.Option id="2" key="2" value="2">
          Option 2
        </MultiSelectInput.Option>,
      ]
      expect(() => {
        render(<MultiSelectInput {...makeProps({children})} />)
      }).not.toThrow()
    })

    it('handles missing option for selected id', () => {
      expect(() => {
        render(<MultiSelectInput {...makeProps({selectedOptionIds: ['999']})} />)
      }).not.toThrow()
    })

    it('auto-selects single filtered option on blur with highlighted option', () => {
      const onChange = jest.fn()
      render(<MultiSelectInput {...makeProps({onChange})} />)

      const input = screen.getByTestId('multi-select-input')

      // Filter to single option
      fireEvent.change(input, {target: {value: 'Option 1'}})

      // Highlight the option with arrow key
      fireEvent.keyDown(input, {key: 'ArrowDown'})

      // Blur/hide options - should auto-select the single filtered option
      fireEvent.blur(input)

      expect(onChange).toHaveBeenCalledWith(['1'])
    })
  })
})
