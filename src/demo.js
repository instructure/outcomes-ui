import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { fromPairs } from 'lodash'
import { Alert } from '@instructure/ui-alerts'
import { Heading } from '@instructure/ui-heading'
import { Checkbox } from '@instructure/ui-checkbox'
import { SimpleSelect } from '@instructure/ui-simple-select'
import { Tabs } from '@instructure/ui-tabs'
import { canvas, canvasHighContrast } from '@instructure/ui-themes'
import { InstUISettingsProvider } from '@instructure/emotion'
import {
  OutcomeAlignments,
  OutcomeCount,
  OutcomesPerStudentReport,
  OutcomeList,
  AlignmentWidget
} from './index'

const themes = {'canvas': canvas, 'canvas-high-contrast': canvasHighContrast}

const rootElement = document.createElement('div')
rootElement.setAttribute('id', 'app')
document.body.appendChild(rootElement)
const alert = document.createElement('div')
alert.setAttribute('id', 'alert')
document.body.appendChild(alert)
const getLive = () => document.getElementById('alert-live-region')
getLive().setAttribute('role', 'alert')

let alertRoot = null
const screenreaderNotification = (text) => {
  if (!alertRoot) {
    alertRoot = createRoot(alert)
  }
  alertRoot.render(
    <Alert screenReaderOnly liveRegion={getLive}>
      {text}
    </Alert>
  )
}
const searchString = window.location.search.slice(1)
const query = fromPairs(searchString.split('&').map((kv) => kv.split('=')))
const createJwt = query.jwt || process.env.CREATE_TOKEN
const createKindergartenJwt = query.jwt || process.env.CREATE_KINDERGARTEN_TOKEN
const createFirstGradeJwt = query.jwt || process.env.CREATE_FIRST_GRADE_TOKEN
const reportJwt = query.jwt || process.env.REPORT_TOKEN
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
    launchContexts,
    emptySetHeading,
    displayMasteryDescription,
    displayMasteryPercentText,
    jwt,
    useAlignmentWidget
  } = props
  return (
    <div  data-automation="artifact">
      <Heading level="h3">
        {name} &nbsp;
        <OutcomeCount
          alignmentSetId={alignmentSetId}
          artifactType={artifactType}
          artifactId={artifactId}
          contextUuid={contextUuid}
          launchContexts={launchContexts}
          host={outcomesHost}
          jwt={jwt}
        />
      </Heading>
      <OutcomeList
        alignmentSetId={alignmentSetId}
        artifactType={artifactType}
        artifactId={artifactId}
        contextUuid={contextUuid}
        launchContexts={launchContexts}
        host={outcomesHost}
        jwt={jwt}
        emptyText="No outcomes are aligned"
      />
      {useAlignmentWidget ? (
        <div>
          <br />
          <AlignmentWidget
            artifactType={artifactType}
            artifactTypeName={artifactTypeName}
            artifactId={artifactId}
            alignmentSetId={alignmentSetId}
            contextUuid={contextUuid}
            host={outcomesHost}
            jwt={jwt}
            liveRegion={getLive}
            screenreaderNotification={screenreaderNotification}
            canManageOutcomes={readOnly === 'false'}
          />
        </div>
      ) : (
        <OutcomeAlignments
          alignmentSetId={alignmentSetId}
          pickerType={currentPicker}
          contextUuid={contextUuid}
          launchContexts={launchContexts}
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
          liveRegion={getLive}
          readOnly={readOnly === 'true'}
        />
      )}
    </div>
  )
}
let currentPicker = 'dialog'
let currentTheme = process?.env?.DEFAULT_HIGH_CONTRAST ? 'canvas-high-contrast' : 'canvas'
let readOnly = 'false'
let currentTab = 'alignments'
let root = null

const reset = () => {
  if (root) {
    root.render(<div />)
  }
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
  readOnly = value
  reset()
}
let showRollups = true
function handleShowRollupsChange() {
  showRollups = !showRollups
  rerender()
}
const handleTabChange = (_, { id }) => {
  currentTab = id
  rerender()
}
function rerender() {
  if (!root) {
    root = createRoot(rootElement)
  }
  root.render(
    <InstUISettingsProvider theme={themes[currentTheme]}>
      <Tabs onRequestTabChange={handleTabChange}>
        <Tabs.Panel id="alignments" renderTitle="Alignments" isSelected={currentTab === 'alignments'}>
          <SimpleSelect
            renderLabel="Picker"
            onChange={handlePickerChange}
            value={currentPicker}
            data-automation="demoAlignment__pickerSelect"
          >
            <SimpleSelect.Option id="dialog" value="dialog">
              Dialog Picker
            </SimpleSelect.Option>
            <SimpleSelect.Option id="tray" value="tray">
              Tray Picker
            </SimpleSelect.Option>
          </SimpleSelect>
          <SimpleSelect
            renderLabel="Read only"
            onChange={handleReadOnlyChange}
            value={readOnly}
          >
            <SimpleSelect.Option id="true" key="true" value="true">
              true
            </SimpleSelect.Option>
            <SimpleSelect.Option id="false" key="false" value="false">
              false
            </SimpleSelect.Option>
          </SimpleSelect>
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
            useAlignmentWidget={true}
            name="Quiz #103"
            artifactType="quizzes.quiz"
            artifactId="103"
            contextUuid="dummy_uuid"
            emptySetHeading="Align Institution outcomes to this quiz."
            jwt={createJwt}
            alignmentWidget={AlignmentWidget}
          />
          {/* Using the strings artifactType and artifactId to not interfere with the
            * other demos that use the same artifactType and artifactId. If we didn't do
            * this, the properties of the last component rendered on the page would take
            * precedence. This would result in the launchContexts not being set in the
            * redux store.
            *
            * The integration test use the demo app to test against. Unfortunately, the tests rely on the order of the
            * artifacts on the page, hence this has to be last. We will fix that as part of OUT-6077
            * https://instructure.atlassian.net/browse/OUT-6077
            */}
          <DemoAlignment
            name='Quiz #XX - with shared contexts (alignment set d15f9530-81af-4ab5-9da7-7b49ee1aac0d)'
            alignmentSetId='d15f9530-81af-4ab5-9da7-7b49ee1aac0d'
            artifactType='artifactType'
            artifactId='artifactId'
            contextUuid="dummy_uuid"
            launchContexts={[
              {uuid:'dummy_uuid',  name:'Dummy UUID - Default uuid'},
              {uuid:'K-science',  name:'The science of K'},
              {uuid:'1-science',  name:'One Science #1'},
            ]}
            emptySetHeading="Align Institution outcomes to this quiz."
            displayMasteryDescription
            displayMasteryPercentText
            artifactTypeName="Quiz"
            jwt={createJwt}
          />
        </Tabs.Panel>
        <Tabs.Panel isSelected={currentTab === 'report'} renderTitle="Report" textAlign="center" id="report">
          <div>
            <Checkbox
              label="Show Rollups"
              checked={showRollups}
              onChange={handleShowRollupsChange}
            />
            <div>
              <OutcomesPerStudentReport
                artifactType={artifactType}
                artifactId={artifactId}
                host={outcomesHost}
                jwt={reportJwt}
                scope="report"
                contextUuid="dummy_uuid"
                showRollups={showRollups}
              />
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel renderTitle="Theme" textAlign="center" id="theme" isSelected={currentTab === 'theme'}>
          <SimpleSelect
            renderLabel="Theme"
            onChange={handleThemeChange}
            value={currentTheme}
          >
            {Object.keys(themes).map((themeKey) => (
              <SimpleSelect.Option id={themeKey} key={themeKey} value={themeKey}>
                {themeKey}
              </SimpleSelect.Option>
            ))}
          </SimpleSelect>
        </Tabs.Panel>
      </Tabs>
    </InstUISettingsProvider>
  )
}
rerender()
