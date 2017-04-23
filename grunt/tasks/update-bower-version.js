module.exports = grunt => {
    grunt.registerTask('update-bower-version', () => {
        let pkg = grunt.config('pkg');
        let filename = grunt.config('bowerFile');
        let file = grunt.file.readJSON(filename);

        file.version = pkg.version;
        grunt.file.write(filename, JSON.stringify(file, null, '  '));
    });
};
