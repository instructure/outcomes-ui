const defaultConfig = require('@instructure/ui-eslint-config')
const defaultExtends = Array.isArray(defaultConfig.extends) ? defaultConfig.extends : [defaultConfig.extends]

module.exports = Object.assign({}, defaultConfig, {
  extends: defaultExtends.concat(['plugin:security/recommended']),
  plugins: defaultConfig.plugins.concat(['immutable', 'promise', 'security', '@typescript-eslint']),
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: Object.assign({}, defaultConfig.rules, {
    /*
    The things these warnings catch really should be fixed. They are probably causing
    bugs in subtle ways. We should work to fix all these warnings and remove these
    lines so they are treated as errors.
    */
    'react/no-unused-prop-types': 'error',
    'react/require-default-props': 0,
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
  }),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
})
