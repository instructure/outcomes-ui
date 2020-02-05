var defaultConfig = require('@instructure/ui-eslint-config')
var defaultExtends = Array.isArray(defaultConfig.extends) ? defaultConfig.extends : [defaultConfig.extends]

delete defaultConfig.overrides[0].rules['mocha/no-exclusive-tests']

module.exports = Object.assign({}, defaultConfig, {
  extends: defaultExtends.concat(['plugin:security/recommended']),
  plugins: defaultConfig.plugins.concat(['security']),
  rules: Object.assign({}, defaultConfig.rules, {
    /*
    The things these warnings catch really should be fixed. They are probably causing
    bugs in subtle ways. We should work to fix all these warnings and remove these
    lines so they are treated as errors.
    */
    'react/forbid-prop-types': 0,

    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true
    }],
    'function-paren-newline': ['error', 'consistent'],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies:['*.config.js', '**/test/*', '**/__tests__/*', '**/demo.js', '**/index.stories.js']
    }],
    'jsx-a11y/anchor-is-valid': 0,
    'security/detect-object-injection': 0,
    'notice/notice': 0,
    'no-unused-expressions': 0,
    'mocha/no-exclusive-tests': process.env.NODE_ENV === 'test' ? 'warn' : 'error',

    // Something in instui is configured incorrectly for this
    'compat/compat': 'off'
  })
})
