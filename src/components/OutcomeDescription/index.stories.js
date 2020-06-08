import React from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import OutcomeDescription from './'

export default {
  title: 'OutcomeDescription'
}

export const standard = () => (
  <OutcomeDescription
    truncate= { boolean('Truncate', true) }
    description= { text('Description', 'Example Description') }
  />
)
