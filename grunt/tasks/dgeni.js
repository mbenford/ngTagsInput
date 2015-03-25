/* global require, process */

'use strict';

var Dgeni = require('dgeni');

module.exports = function(grunt) {
    grunt.registerTask('dgeni', function() {
        var done = this.async(),
            dgeni = new Dgeni([require(process.cwd() + '/docs/dgeni-config.js')]);

        dgeni.generate().then(done);
    });
};
