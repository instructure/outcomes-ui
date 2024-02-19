import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import OutcomesPerStudentReport from '../OutcomesPerStudentReport'
import styles from '../../components/OutcomesPerStudent/styles.js'
import { findElementsWithStyle } from '../../util/__tests__/findElementsWithStyle'
import generateComponentTheme from '../../components/theme'

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
    const wrapper = mount(
      <div id="app"><OutcomesPerStudentReport {...makeProps()} /></div>
    )
    expect(findElementsWithStyle(wrapper, styles(generateComponentTheme).background)).to.have.length(1)
  })
})
