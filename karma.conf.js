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
      'test/tags-input.spec.js',
      'test/auto-complete.spec.js',
      'test/transclude-append.spec.js',
      'test/autosize.spec.js',
      'src/keycodes.js',
      'src/tags-input.js',
      'src/auto-complete.js',
      'src/transclude-append.js',
      'src/autosize.js',
      'src/configuration.js',
      'templates/*.html'
    ],

    preprocessors: {
        'templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'templates/',
        prependPrefix: 'ngTagsInput/',
        moduleName: 'ngTagsInput'
    },

    // list of files to exclude
    exclude: [
      
    ],


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
