import React from 'react'
import { text } from '@storybook/addon-knobs'
import OutcomeDescription from './'

export default {
  title: 'OutcomeDescription'
}

export const standard = () => (
  <OutcomeDescription
    label= { text('Label', 'Example Label') }
    description= { text('Description', 'Example Description') }
  />
)
