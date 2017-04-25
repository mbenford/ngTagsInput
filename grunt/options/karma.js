/* global process: false */

module.exports = grunt => ({
  options: {
    configFile: 'karma.conf.js'
  },
  local: {
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['mocha', 'coverage'],
    mochaReporter: {
      output: process.env.TRAVIS ? 'full' : 'minimal'
    }
  },
  remote: {
    singleRun: true,
    captureTimeout: 120000,
    sauceLabs: {
      testName: 'ngTagsInput'
    },
    recordVideo: false,
    recordScreenshots: false,
    customLaunchers: grunt.file.readJSON('sauce.launchers.json'),
    reporters: ['mocha', 'saucelabs']
  }
});