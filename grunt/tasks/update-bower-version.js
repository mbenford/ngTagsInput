'use strict';

module.exports = function(grunt) {
    grunt.registerTask('update-bower-version', function() {
        var pkg = grunt.config('pkg'),
            filename = grunt.config('bowerFile'),
            file = grunt.file.readJSON(filename);

        file.version = pkg.version;
        grunt.file.write(filename, JSON.stringify(file, null, '  '));
    });
};
