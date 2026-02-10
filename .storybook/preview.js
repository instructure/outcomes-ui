import { initialize, mswLoader } from 'msw-storybook-addon'

// Initialize MSW
initialize()

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    options: {
      showPanel: true
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  loaders: [mswLoader],
}

export default preview
