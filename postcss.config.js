// eslint-disable-next-line
module.exports = require('@instructure/ui-postcss-config')({
  before: {
    plugin: 'postcss-nested'
  },
  nesting: false // Set to true to use postcss-nesting instead of postcss-nested, defaults to false
})
