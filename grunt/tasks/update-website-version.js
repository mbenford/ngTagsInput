'use strict';

module.exports = function(grunt) {
    grunt.registerTask('update-website-version', function() {
        var pkg = grunt.config('pkg'),
            filename = grunt.config('websiteConfigFile'),
            file = grunt.file.read(filename);

        file = file.replace(/stable_version:.*/, 'stable_version: ' + pkg.version);
        grunt.file.write(filename, file);
    });
};
