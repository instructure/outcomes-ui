import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import AlignmentWidget from '../AlignmentWidget'

// eslint-disable-next-line react/display-name
jest.mock('../../components/AlignmentWidget', () => props => {
  return (
    <div>
      <p>AlignmentWidget</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('AlignmentWidget', () => {
  function makeProps (props = {}) {
    const store = createMockStore()
    return Object.assign({
      store,
      artifactType: 'foo',
      emptySetHeading: '',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }, props)
  }

  it('renders', () => {
    render(
      <div id="app"><AlignmentWidget {...makeProps()} /></div>
    )
    expect(screen.getByText('AlignmentWidget')).toBeInTheDocument()
  })

  it('sets the scope', () => {
    const props = makeProps()
    render(
      <div id="app"><AlignmentWidget {...props} /></div>
    )
    expect(screen.getByText('foo:::1')).toBeInTheDocument()
  })

  it('uses proper fallbacks if store is not passed in props', () => {
    const props = makeProps({store: void 0})
    render(
      <div id="app"><AlignmentWidget {...props} /></div>
    )
    expect(screen.getByText('foo:::1')).toBeInTheDocument()
  })
})
