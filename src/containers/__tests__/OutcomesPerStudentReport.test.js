import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import OutcomesPerStudentReport from '../OutcomesPerStudentReport'
import styles from '../../components/OutcomesPerStudent/styles.css'

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
      jwt: ''
    }
  }

  it('renders', () => {
    const wrapper = mount(
      <div id="app"><OutcomesPerStudentReport {...makeProps()} /></div>
    )
    expect(wrapper.find(`.${styles.background}`)).to.have.length(1)
  })
})
