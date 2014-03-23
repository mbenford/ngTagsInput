module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'test/lib/jquery-1.10.2.min.js',
      'test/lib/angular.js',
      'test/lib/angular-mocks.js',
      'test/helpers.js',
      'test/matchers.js',
      'test/*.spec.js',
      'src/init.js',
      'src/*.js',
      'templates/*.html'
    ],

    preprocessors: {
      'templates/*.html': ['ng-html2js'],
      'src/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'templates/',
      prependPrefix: 'ngTagsInput/',
      moduleName: 'ngTagsInput'
    },

    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    },

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
