import {expect, jest} from '@jest/globals'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {axe, toHaveNoViolations} from 'jest-axe'
import OutcomeFolder from '../index'

expect.extend(toHaveNoViolations)

describe('OutcomeFolder', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        outcome: {id: '101', label: 'XYZ', title: 'The student will make cupcakes'},
        clickable: true,
        getOutcomeSummary: jest.fn(),
        setActiveCollection: jest.fn(),
        toggleExpandedIds: jest.fn(),
      },
      props
    )
  }

  it('will set the active collection and expand when the title is clicked', () => {
    const props = makeProps()
    render(<OutcomeFolder {...props} />)

    const link = screen.getByText('The student will make cupcakes')
    fireEvent.click(link)

    expect(props.setActiveCollection).toHaveBeenCalledWith('101')
    expect(props.toggleExpandedIds).toHaveBeenCalledWith({id: '101', forceOpen: true})
  })

  it('will ensure the activeCollection is expanded before setting a new one', () => {
    const props = makeProps({activeCollectionId: '1'})
    render(<OutcomeFolder {...props} />)

    const link = screen.getByText('The student will make cupcakes')
    fireEvent.click(link)

    expect(props.toggleExpandedIds).toHaveBeenCalledWith({id: '1', forceOpen: true})
    expect(props.toggleExpandedIds).toHaveBeenCalledWith({id: '101', forceOpen: true})
  })

  it('will make titles unclickable if clickable set to false', () => {
    const props = makeProps({clickable: false})
    render(<OutcomeFolder {...props} />)

    expect(screen.getByText('The student will make cupcakes')).toBeInTheDocument()

    const link = screen.queryByRole('link')
    expect(link).not.toBeInTheDocument()
  })

  it('meets a11y standards', async () => {
    const {container} = render(<OutcomeFolder {...makeProps()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
