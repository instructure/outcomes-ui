import { storyNameFromExport } from '@storybook/router/utils'
import {  addParameters, configure, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import theme from '@instructure/canvas-theme'

addParameters({
  options: {
    showPanel: true
  }
})

const manualExamplesContext = require.context('../../', true, /^.*\/src\/.*\.stories\.js$/)

function loadStories () {
  manualExamplesContext.keys().forEach(fname => {
    const exports = manualExamplesContext(fname)
    const title = exports.default.title
    const storyContext = storiesOf(title).addDecorator(withKnobs)

    Object.entries(exports).forEach(([key, value]) => {
      if (key !== 'default') {
        storyContext.add(storyNameFromExport(key), value)
      }
    })
  })
}

configure(loadStories, module)
