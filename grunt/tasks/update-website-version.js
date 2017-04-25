module.exports = grunt => {
  grunt.registerTask('update-website-version', () => {
    let pkg = grunt.config('pkg');
    let filename = grunt.config('websiteConfigFile');
    let file = grunt.file.read(filename);

    file = file.replace(/stable_version:.*/, 'stable_version: ' + pkg.version);
    grunt.file.write(filename, file);
  });
};
