/* eslint-env jest */
// Mock for msw-storybook-addon in Jest environment
// Storybook MSW integration is not needed in Jest tests

// Provide a default export as well for ES6 imports
const mswStorybook = {
  initialize: jest.fn(),
  mswLoader: jest.fn(() => ({})),
}

module.exports = mswStorybook
module.exports.initialize = mswStorybook.initialize
module.exports.mswLoader = mswStorybook.mswLoader
module.exports.default = mswStorybook
