import React from 'react'
import { number } from '@storybook/addon-knobs'
import AlignmentCount from './'

export default {
  title: 'AlignmentCount'
}

export const alignedOutcomes = () => (
  <AlignmentCount
    count={ number('Alignments', 5) }
  />
)
