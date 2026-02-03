import MultiSelectInput from './index'
import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { IconCoursesLine } from '@instructure/ui-icons'

const meta: Meta<typeof MultiSelectInput> = {
  title: 'MultiSelectInput',
  component: MultiSelectInput,
}

export default meta

type Story = StoryObj<typeof MultiSelectInput>

const options = [
  {id: '1', text: 'Mathematics', group: 'STEM'},
  {id: '2', text: 'Physics', group: 'STEM'},
  {id: '3', text: 'English Literature', group: 'Arts & Humanities'},
  {id: '4', text: 'History', group: 'Arts & Humanities'},
  {id: '5', text: 'Psychology', group: 'Social Sciences'},
]

export const Basic: Story = {
  args: {
    label: 'Select Options',
    onChange: action('onChange'),
    placeholder: 'Choose Multiple Subjects...',
    customRenderBeforeInput: (tags) => [<IconCoursesLine key="search-icon" />, ...(tags || [])],
    children: options.map(o => (
      <MultiSelectInput.Option id={o.id} key={o.id} value={o.id} group={o.group}>
        {o.text}
      </MultiSelectInput.Option>
    )),
  },
}
