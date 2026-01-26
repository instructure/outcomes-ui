const { globSync } = require('glob')
const path = require('path')

function getSourceFilesThatHaveJestRTLTests() {
  return globSync('src/**/__tests__/*.test.js', { nodir: true })
    .map(file => {
      const filename = path.basename(file).replace('.test.', '.')
      const testedFilePath = path.dirname(file).split('/').slice(0, -1).join('/') + '/' + filename
      return testedFilePath
    })
}

function getStyleSourceFiles() {
  return globSync('src/**/styles.js', { nodir: true })
}

module.exports = {
  getSourceFilesThatHaveJestRTLTests,
  getStyleSourceFiles,
}
