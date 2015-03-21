/* global process: false */

'use strict';

module.exports = function(grunt) {
    grunt.registerTask('sauce', function(browsers) {
        var sauce, config;

        if (!process.env.SAUCE_USERNAME) {
            if (!grunt.file.exists('sauce.json')) {
                grunt.fail.fatal('sauce.json not found', 3);
            }
            else {
                sauce = grunt.file.readJSON('sauce.json');
                process.env.SAUCE_USERNAME = sauce.username;
                process.env.SAUCE_ACCESS_KEY = sauce.accessKey;
            }
        }

        config = grunt.config.get('karma.remote');
        config.browsers = browsers ? browsers.split(',') : Object.keys(config.customLaunchers);
        grunt.config.set('karma.remote', config);
        grunt.task.run('karma:remote');
    });
};
