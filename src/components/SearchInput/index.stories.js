import React from 'react'
import { text } from '@storybook/addon-knobs'
import SearchInput from './'

export default {
  title: 'SearchInput'
}

export const standard = () => (
  <SearchInput searchText={ text('Search Text', '') } />
)
