/* global require, process */

const Dgeni = require('dgeni');

module.exports = grunt => {
    grunt.registerTask('dgeni', () => {
        let done = this.async();
        let dgeni = new Dgeni([require(process.cwd() + '/docs/dgeni-config.js')]);

        dgeni.generate().then(done);
    });
};
