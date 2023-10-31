var defaultConfig = require('@instructure/ui-eslint-config')
var defaultExtends = Array.isArray(defaultConfig.extends) ? defaultConfig.extends : [defaultConfig.extends]

delete defaultConfig.overrides[0].rules['mocha/no-exclusive-tests']

module.exports = Object.assign({}, defaultConfig, {
  extends: defaultExtends.concat(['plugin:security/recommended', 'plugin:react-redux/recommended']),
  plugins: defaultConfig.plugins.concat(['immutable', 'promise', 'security', 'react-redux']),
  rules: Object.assign({}, defaultConfig.rules, {
    /*
    The things these warnings catch really should be fixed. They are probably causing
    bugs in subtle ways. We should work to fix all these warnings and remove these
    lines so they are treated as errors.
    */
    'react/no-unused-prop-types': 'error',
    'react/forbid-prop-types': ['error', {
      forbid: ['any'] // TODO: add 'array', 'object'
    }],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true
    }],
    'function-paren-newline': ['error', 'consistent'],
    'import/no-extraneous-dependencies': ['error', {devDependencies: true}],
    'jsx-a11y/anchor-is-valid': 0,
    'security/detect-object-injection': 0,
    'notice/notice': 0,
    'no-unused-expressions': 0,
    'mocha/no-exclusive-tests': process.env.NODE_ENV === 'test' ? 'warn' : 'error',
    'promise/no-nesting': 'off',

    // Something in instui is configured incorrectly for this
    'compat/compat': 'off',
    'react/no-unknown-property': [
      'error',
      {
        'ignore': ['css']
      }
    ],
    'max-len': ['error', {
      code: 120,
      ignoreTrailingComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true
    }],
  })
})
