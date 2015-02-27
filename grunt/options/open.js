'use strict';

module.exports = function(grunt) {
    return {
        coverage: {
            path: grunt.file.expand('coverage/**/lcov-report/index.html')[0]
        }
    };
};