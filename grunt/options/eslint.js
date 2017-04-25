module.exports = grunt => ({
    options: {
        configFile: '.eslintrc.js',
        format: 'codeframe'
    },
    build: [
        grunt.file.expand('./grunt/*'),
        'Gruntfile.js',
        'karma.conf.js',
        ['<%= files.js.src %>'],
        ['<%= files.spec.src %>']
    ]
});
