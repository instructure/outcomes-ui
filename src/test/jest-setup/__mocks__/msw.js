/* eslint-env jest */
// Mock for msw in Jest environment
// MSW is used in Storybook but not needed in Jest snapshot tests

const HttpResponse = {
  json: jest.fn((data, options) => ({ data, options })),
  text: jest.fn((text, options) => ({ text, options })),
}

const http = {
  get: jest.fn(() => jest.fn()),
  post: jest.fn(() => jest.fn()),
  put: jest.fn(() => jest.fn()),
  patch: jest.fn(() => jest.fn()),
  delete: jest.fn(() => jest.fn()),
  all: jest.fn(() => jest.fn()),
}

const setupWorker = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  use: jest.fn(),
}))

const setupServer = jest.fn(() => ({
  listen: jest.fn(),
  close: jest.fn(),
  use: jest.fn(),
}))

module.exports = {
  http,
  HttpResponse,
  setupWorker,
  setupServer,
}
