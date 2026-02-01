import React from 'react'
import { expect, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { IconButton } from '@instructure/ui-buttons'
import { IconMoreLine } from '@instructure/ui-icons'
import { SortOrder } from '@util/Gradebook/constants'
import OutcomeHeaderMenu from '../index'

describe('OutcomeHeaderMenu', () => {
  function makeProps(props = {}) {
    return Object.assign(
      {
        trigger: (
          <IconButton screenReaderLabel="Outcome options">
            <IconMoreLine />
          </IconButton>
        ),
        sortOrder: SortOrder.ASC,
        isContributingScoresVisible: false,
        onSortChange: jest.fn(),
        onContributingScoresToggle: jest.fn(),
        onShowOutcomeInfoClick: jest.fn(),
        onShowOutcomeDistributionClick: jest.fn(),
      },
      props
    )
  }

  const openMenu = (container: HTMLElement) => {
    const triggerButton = container.querySelector('button')
    if (triggerButton) {
      fireEvent.click(triggerButton)
    }
  }

  it('renders the Sort menu group', () => {
    const { container } = render(<OutcomeHeaderMenu {...makeProps()} />)
    openMenu(container)
    expect(screen.getByText('Sort')).toBeInTheDocument()
  })

  it('renders ascending menu item', () => {
    const { container } = render(<OutcomeHeaderMenu {...makeProps()} />)
    openMenu(container)
    expect(screen.getByText('Ascending')).toBeInTheDocument()
  })

  it('renders descending menu item', () => {
    const { container } = render(<OutcomeHeaderMenu {...makeProps()} />)
    openMenu(container)
    expect(screen.getByText('Descending')).toBeInTheDocument()
  })

  it('calls onSortChange with ASC when ascending item is clicked', () => {
    const props = makeProps()
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    const ascendingItem = screen.getByText('Ascending')
    fireEvent.click(ascendingItem)
    expect(props.onSortChange).toHaveBeenCalledWith(SortOrder.ASC)
  })

  it('calls onSortChange with DESC when descending item is clicked', () => {
    const props = makeProps()
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    const descendingItem = screen.getByText('Descending')
    fireEvent.click(descendingItem)
    expect(props.onSortChange).toHaveBeenCalledWith(SortOrder.DESC)
  })

  it('shows ascending item as selected when sortOrder is ASC', () => {
    const props = makeProps({
      sortOrder: SortOrder.ASC,
    })
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    expect(screen.getByText('Ascending')).toBeInTheDocument()
    expect(screen.getByText('Descending')).toBeInTheDocument()
  })

  it('shows descending item as selected when sortOrder is DESC', () => {
    const props = makeProps({
      sortOrder: SortOrder.DESC,
    })
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    expect(screen.getByText('Ascending')).toBeInTheDocument()
    expect(screen.getByText('Descending')).toBeInTheDocument()
  })

  it('renders Display menu items', () => {
    const props = makeProps()
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    expect(screen.getByText('Show Contributing Scores')).toBeInTheDocument()
    expect(screen.getByText('Show Outcome Info')).toBeInTheDocument()
    expect(screen.getByText('Show Outcome Distribution')).toBeInTheDocument()
  })

  it('calls onContributingScoresToggle when contributing scores item is clicked', () => {
    const props = makeProps()
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    const contributingScoresItem = screen.getByText('Show Contributing Scores')
    fireEvent.click(contributingScoresItem)
    expect(props.onContributingScoresToggle).toHaveBeenCalled()
  })

  it('shows "Hide Contributing Scores" when isContributingScoresVisible is true', () => {
    const props = makeProps({ isContributingScoresVisible: true })
    const { container } = render(<OutcomeHeaderMenu {...props} />)
    openMenu(container)
    expect(screen.getByText('Hide Contributing Scores')).toBeInTheDocument()
  })
})
