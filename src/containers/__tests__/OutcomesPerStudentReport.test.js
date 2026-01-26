import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import OutcomesPerStudentReport from '../OutcomesPerStudentReport.js'

describe('OutcomesPerStudentReport', () => {
  function makeProps () {
    return {
      users: [
        {
          id: 1,
          displayName: 'Darius Jackson',
          outcomeResults: {
            1: { percentScore: 0.8, points: 4, pointsPossible: 5, mastery: true }
          }
        }
      ],
      artifactType: '',
      artifactId: '',
      host: '',
      jwt: '',
      showAlert: () => {}
    }
  }

  it('renders', () => {
    render(<OutcomesPerStudentReport {...makeProps()} />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })
})
