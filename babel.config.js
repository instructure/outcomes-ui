// eslint-disable-next-line immutable/no-mutation
module.exports = {
  presets: [
    [
      'quiz-presets/babel-preset-instructure-quizzes',
      {
        translationsDir: './translations',
        extractDefaultTranslations: false
      }
    ],
    ['@instructure/ui-babel-preset', {
      themeable: !process.env.DEBUG && process.env.NODE_ENV !== 'test',
      coverage: process.env.NODE_ENV === 'test'
    }]
  ],
  plugins: [
    "inline-react-svg"
  ]
}
