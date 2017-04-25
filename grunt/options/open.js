module.exports = grunt => ({
    coverage: {
        path: grunt.file.expand('coverage/**/html-report/index.html')[0]
    }
});