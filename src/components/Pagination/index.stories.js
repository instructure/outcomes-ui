import React from 'react'
import { number } from '@storybook/addon-knobs'
import Pagination from './'

export default {
  title: 'Pagination'
}

export const standard = () => (
  <Pagination
    numPages= { number('numPages', 2) }
    page= { number('page', 1)}
    updatePage= { () => {} }
  />
)
