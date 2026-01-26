import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import OutcomeCount from '../OutcomeCount'

// eslint-disable-next-line react/display-name
jest.mock('../../components/AlignmentCount', () => props => {
  return (
    <div>
      <p>AlignmentCount</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('OutcomeCount', () => {
  function makeProps (props = {}) {
    const store = createMockStore()
    return Object.assign({
      store,
      alignmentSetId: '',
      artifactType: 'foo',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }, props)
  }

  it('renders', () => {
    render(<div id="app"><OutcomeCount {...makeProps()} /></div>)
    expect(screen.getByText('AlignmentCount')).toBeInTheDocument()
  })

  it('sets the scope', () => {
    const props = makeProps()
    render(<div id="app"><OutcomeCount {...props} /></div>)
    expect(screen.getByText('foo:::1')).toBeInTheDocument()
  })

  it('uses proper fallbacks if store not passed in props', () => {
    const props = {artifactType: 'foo', artifactId: '1', host: '', jwt: '', alignmentSetId: ''}
    render(<div id="app"><OutcomeCount {...props} /></div>)
    expect(screen.getByText('foo:::1')).toBeInTheDocument()
  })
})
