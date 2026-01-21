const path = require('path')

// eslint-disable-next-line immutable/no-mutation
module.exports = {
  presets: [
    ['@instructure/ui-babel-preset', {
      themeable: !process.env.DEBUG && process.env.NODE_ENV !== 'test',
      coverage: process.env.NODE_ENV === 'test',
      esModules: Boolean(process.env.ES_MODULES)
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    'inline-react-svg',
    ['@babel/plugin-transform-private-property-in-object', { 'loose': true }],
    ['@babel/plugin-proposal-decorators', { 'version': 'legacy' }],
    ['@babel/plugin-transform-private-methods', { 'loose': true }],
    ...getFormatMessageConfig()
  ]
}

function getFormatMessageConfig () {
  const translationsDir = './translations'

  let formatMessageConfig = []
  // if a BUILD_LOCALE environment variable is set, generate pre-translated source for that language,
  const BUILD_LOCALE = process.env.BUILD_LOCALE
  if (BUILD_LOCALE) {
    formatMessageConfig = [
      ['transform-format-message', {
        generateId: 'underscored_crc32',
        inline: true,
        locale: BUILD_LOCALE,
        translations: {
          // eslint-disable-next-line security/detect-non-literal-require
          [BUILD_LOCALE]: require(path.join(process.cwd(), translationsDir, BUILD_LOCALE))
        }
      }]
    ]
  }
  return formatMessageConfig
}
