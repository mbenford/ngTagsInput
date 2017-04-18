'use strict';

module.exports = {
    options: {
        sourceMap: true,
        presets: ['babel-preset-es2015'],
    },
    build: {
        files: {
            '<%= files.js.out %>': ['<%= files.js.out %>']
        }
    }
};