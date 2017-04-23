module.exports = grunt => ({
    coverage: {
        path: grunt.file.expand('coverage/**/lcov-report/index.html')[0]
    }
});