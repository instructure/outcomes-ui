import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import { render } from 'react-dom'
import fromPairs from 'lodash.frompairs'
import '@instructure/canvas-theme'
import '@instructure/canvas-high-contrast-theme'
import { Alert } from '@instructure/ui-alerts'
import { Heading } from '@instructure/ui-elements'
import { Checkbox, Select } from '@instructure/ui-forms'
import {TabList, TabPanel} from '@instructure/ui-tabs'
import { ApplyTheme } from '@instructure/ui-themeable'

import {
  OutcomeAlignments,
  OutcomeCount,
  OutcomesPerStudentReport,
  OutcomeList,
  StudentMastery,
  AlignmentButton
} from './index'
import styles from './index.css'

const themes = ['canvas', 'canvas-high-contrast']

const root = document.createElement('div')
root.setAttribute('id', 'app')
root.classList.add(styles.root)
document.body.appendChild(root)

const alert = document.createElement('div')
alert.setAttribute('id', 'alert')
document.body.appendChild(alert)

const getLive = () => document.getElementById('alert-live-region')

getLive().setAttribute('role', 'alert')

const screenreaderNotification = (text) => {
  render(<Alert screenReaderOnly liveRegion={getLive}>{text}</Alert>, alert)
}
const searchString = window.location.search.slice(1)
const query = fromPairs(searchString.split('&').map((kv) => kv.split('=')))

const createJwt = query.jwt || process.env.CREATE_TOKEN
const createKindergartenJwt = query.jwt || process.env.CREATE_KINDERGARTEN_TOKEN
const createFirstGradeJwt = query.jwt || process.env.CREATE_FIRST_GRADE_TOKEN
const reportJwt = query.jwt || process.env.REPORT_TOKEN
const individualReportUserUuid = query.userUuid || process.env.INDIVIDUAL_REPORT_USER_UUID
const individualReportJwt = query.jwt || process.env.INDIVIDUAL_REPORT_TOKEN
const outcomesHost = `http://${query.host || window.location.host}`

const { artifactType = 'quizzes.quiz', artifactId = '99' } = query

const DemoAlignment = (props) => {
  /* eslint-disable no-console, react/prop-types */
  const {
    name,
    alignmentSetId,
    artifactType,
    artifactId,
    artifactTypeName,
    contextUuid,
    emptySetHeading,
    displayMasteryDescription,
    displayMasteryPercentText,
    jwt,
    useAlignmentButton
  } = props
  return (
    <div className={styles.item} data-automation="artifact">
      <Heading level="h3">
        { name } &nbsp;
        <OutcomeCount
          alignmentSetId={alignmentSetId}
          artifactType={artifactType}
          artifactId={artifactId}
          contextUuid={contextUuid}
          host={outcomesHost}
          jwt={jwt}
        />
      </Heading>
      <OutcomeList
        alignmentSetId={alignmentSetId}
        artifactType={artifactType}
        artifactId={artifactId}
        contextUuid={contextUuid}
        host={outcomesHost}
        jwt={jwt}
        emptyText="No outcomes are aligned"
      />
      {
        useAlignmentButton ? (
          <AlignmentButton
            artifactType={artifactType}
            artifactTypeName={artifactTypeName}
            artifactId={artifactId}
            alignmentSetId={alignmentSetId}
            contextUuid={contextUuid}
            host={outcomesHost}
            jwt={jwt}
            liveRegion={getLive()}
            screenreaderNotification={screenreaderNotification}
          />
        ) : (
          <OutcomeAlignments
            alignmentSetId={alignmentSetId}
            pickerType={currentPicker}
            contextUuid={contextUuid}
            emptySetHeading={emptySetHeading}
            onUpdate={console.log}
            artifactType={artifactType}
            artifactId={artifactId}
            artifactTypeName={artifactTypeName}
            displayMasteryDescription={displayMasteryDescription}
            displayMasteryPercentText={displayMasteryPercentText}
            host={outcomesHost}
            jwt={jwt}
            screenreaderNotification={screenreaderNotification}
            liveRegion={getLive()}
            readOnly={readOnly}
          />
        )
      }
    </div>
  )
}

const getDefaultContrast = () => {
  if(process.env.DEFAULT_HIGH_CONTRAST) {
    return 'canvas-high-contrast'
  }
  return 'canvas'
}

let currentPicker = 'dialog'
let currentTheme = getDefaultContrast()
let readOnly = false
const reset = () => {
  render(<div />, root)
  rerender()
}
const handleThemeChange = (_, { value: theme }) => {
  currentTheme = theme
  reset()
}

const handlePickerChange = (_, { value: picker }) => {
  currentPicker = picker
  reset()
}

const handleReadOnlyChange = (_, { value }) => {
  readOnly = (value === 'true')
  reset()
}

let showRollups = true
function handleShowRollupsChange () {
  showRollups = !showRollups
  rerender()
}

function rerender () {
  render(
    <ApplyTheme theme={ApplyTheme.generateTheme(currentTheme)}>
      <TabList variant="minimal" size="large">
        <TabPanel title="Alignments">
          <Select name="picker" label="Picker" layout="inline" onChange={handlePickerChange} value="dialog" data-automation="demoAlignment__pickerSelect">
            <option key="dialog" value="dialog">Dialog Picker</option>
            <option key="tray" value="tray">Tray Picker</option>
          </Select>
          <Select name="picker" label="Read only" layout="inline" onChange={handleReadOnlyChange} value="false">
            <option key="true" value="true">true</option>
            <option key="false" value="false">false</option>
          </Select>
          <DemoAlignment
            name="Quiz #99"
            alignmentSetId="d15f9530-81af-4ab5-9da7-7b49ee1aac0d"
            artifactType={artifactType}
            artifactId={artifactId}
            contextUuid="dummy_uuid"
            emptySetHeading="Align Institution outcomes to this quiz."
            displayMasteryDescription
            displayMasteryPercentText
            artifactTypeName="Quiz"
            jwt={createJwt}
          />
          <DemoAlignment
            alignmentSetId=""
            name="Question #100"
            contextUuid="dummy_uuid"
            artifactType="quizzes.item"
            artifactId="100"
            emptySetHeading="Align Institution outcomes to this question."
            jwt={createJwt}
          />
          <DemoAlignment
            alignmentSetId=""
            name="Kindergarten Science Question #101"
            artifactType="quizzes.item"
            artifactId="101"
            contextUuid="K-science"
            emptySetHeading="Align Institution outcomes to this question."
            jwt={createKindergartenJwt}
          />
          <DemoAlignment
            alignmentSetId=""
            name="First Grade Science Question #102"
            artifactType="quizzes.item"
            artifactId="102"
            contextUuid="1-science"
            emptySetHeading="Align Institution outcomes to this question."
            jwt={createFirstGradeJwt}
          />
          <DemoAlignment
            alignmentSetId=""
            useAlignmentButton={true}
            name="Quiz Question #103"
            artifactType="quizzes.item"
            artifactId="103"
            contextUuid="dummy_uuid"
            emptySetHeading="Align Institution outcomes to this question."
            jwt={createJwt}
            alignmentWidget={AlignmentButton}
          />
        </TabPanel>
        <TabPanel title="Report" textAlign="center">
          <div style={{backgroundColor: 'lightgrey'}}>
            <Checkbox label="Show Rollups" checked={showRollups} onChange={handleShowRollupsChange} />
            <div className={styles.report}>
              <OutcomesPerStudentReport
                artifactType={artifactType}
                artifactId={artifactId}
                host={outcomesHost}
                jwt={reportJwt}
                scope="report"
                showRollups={showRollups}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel title="Student Performance" textAlign="center" data-automation="studentPerformance__report">
          <div className={styles.mastery}>
            <StudentMastery
              mastery
              artifactType={artifactType}
              artifactId={artifactId}
              host={outcomesHost}
              jwt={individualReportJwt}
              userUuid={individualReportUserUuid}
            />
          </div>
          <div className={styles.mastery}>
            <StudentMastery
              mastery={false}
              artifactType={artifactType}
              artifactId={artifactId}
              host={outcomesHost}
              jwt={individualReportJwt}
              userUuid={individualReportUserUuid}
            />
          </div>
        </TabPanel>
        <TabPanel title="Theme" textAlign="center">
          <Select name="theme" label="Theme" layout="inline" onChange={handleThemeChange} value={currentTheme}>
            {
              themes.map(themeKey => <option key={themeKey} value={themeKey}>{themeKey}</option>)
            }
          </Select>
        </TabPanel>
      </TabList>
    </ApplyTheme>,
    root
  )
}

rerender()
