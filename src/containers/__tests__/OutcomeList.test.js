import React from 'react'
import { jest, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import createMockStore from '../../test/createMockStore_jest_rtl'
import OutcomeList from '../OutcomeList'

// eslint-disable-next-line react/display-name
jest.mock('../../components/OutcomeLabels', () => props => {
  return (
    <div>
      <p>OutcomeLabels</p>
      <p>{props.scope}</p>
    </div>
  )
})

describe('OutcomeList', () => {
  function makeProps () {
    const store = createMockStore()
    return {
      store,
      artifactType: 'foo',
      artifactId: '1',
      host: 'http://foo.outcomes.foo',
      jwt: 'secretfoo'
    }
  }

  it('renders', () => {
    render(
      <div id="app"><OutcomeList {...makeProps()} /></div>
    )
    expect(screen.getByText('OutcomeLabels')).toBeInTheDocument()
  })

  it('sets the scope', () => {
    const props = makeProps()
    render(<div id="app"><OutcomeList {...props} /></div>)
    expect(screen.getByText('foo:::1')).toBeInTheDocument()
  })
})
