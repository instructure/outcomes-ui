import initStoryshots, { shallowSnapshot } from '@storybook/addon-storyshots'

// Mock translationLoader for all Storybook tests
jest.mock('../src/i18n/translationLoader')

initStoryshots({
  test: shallowSnapshot,
  framework: 'react',
})
