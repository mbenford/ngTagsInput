'use strict';

module.exports = function(grunt) {
    return {
        files: [
            grunt.file.expand('./grunt/*'),
            'Gruntfile.js',
            'karma.conf.js',
            ['<%= files.js.src %>'],
            ['<%= files.spec.src %>']
        ],
        options: {
            jshintrc: '.jshintrc',
            reporterOutput: ''
        }
    };
};