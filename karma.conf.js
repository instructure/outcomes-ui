const sharedWebpack = require('./webpack.config.js')

const withCoverage = process.argv.some((arg) => arg === '--coverage')
const headless = process.argv.some((arg) => arg === '--headless')
const noSandbox = process.argv.some((arg) => arg === '--no-sandbox')

let browsers
if (headless) {
  browsers = noSandbox ? ['ChromiumHeadless_no_sandbox'] : ['ChromiumHeadless']
} else {
  browsers = noSandbox ? ['Chromium_no_sandbox'] : ['Chromium']
}

const coverageArgs = { plugins: [], reporters: [], coverageReporter: null }
if (withCoverage) {
  // eslint-disable-next-line immutable/no-mutation
  coverageArgs.coverageReporter = {
    reporters: [
      { type: 'text-summary' },
      { type: 'lcov', dir: 'coverage/', subdir: 'ui' },
      { type: 'html', dir: 'coverage/', subdir: 'ui' }
    ],
    check: {
      global: { // fail if overall coverage too low
        lines: 95
      },
      each: { // fail if individual file coverage too low
        lines: 90
      }
    }
  }
  coverageArgs.reporters.push('coverage')
}

// eslint-disable-next-line immutable/no-mutation
module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      './src/entrypoint.test.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: Object.assign({}, sharedWebpack, {
      // enzyme is looking for some older react classes in compatibility code
      // that we won't ever execute
      externals: Object.assign({
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window'
      }, sharedWebpack.externals)
    }),

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'spec', 'junit'].concat(coverageArgs.reporters),

    // this is to make a nice "spec failures" report in the jenkins build instead of having to look at the log output
    junitReporter: {
      outputDir: 'coverage/ui/karma-junit-reports',
      useBrowserName: false // don't add browser name to report and classes names
    },
    specReporter: {
      maxLogLines: 25,             // limit number of lines logged per test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false,       // do not print information about failed tests
      suppressPassed: false,       // do not print information about passed tests
      suppressSkipped: true,       // do not print information about skipped tests
      showSpecTiming: true,        // print the time elapsed for each spec
      failFast: false              // test would finish with error when a first fail occurs.
    },
    coverageReporter: coverageArgs.coverageReporter,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: browsers,
    customLaunchers: {
      Chromium_no_sandbox: {
        base: 'Chromium',
        flags: ['--no-sandbox']
      },
      ChromiumHeadless_no_sandbox: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox']
      }
    },

    browserDisconnectTimeout: 20000,

    browserNoActivityTimeout: 20000,

    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    captureTimeout: 120000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
