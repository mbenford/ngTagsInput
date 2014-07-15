module.exports = {
    options: {
        configFile: 'karma.conf.js'
    },
    continuous: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
    }
};