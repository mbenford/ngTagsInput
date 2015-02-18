'use strict';

module.exports = function(grunt) {
    grunt.registerTask('update-bower-version', function() {
        var pkg = grunt.config('pkg'),
            bowerFile = grunt.config('bowerFile'),
            bower = grunt.file.readJSON(bowerFile);

        bower.version = pkg.version;
        grunt.file.write(bowerFile, JSON.stringify(bower, null, '  '));
    });
};
