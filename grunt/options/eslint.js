module.exports = function(grunt) {
    return {
        options: {
            configFile: '.eslintrc.js',
            format: 'codeframe'
        },
        target: [
            grunt.file.expand('./grunt/*'),
            'Gruntfile.js',
            'karma.conf.js',
            ['<%= files.js.src %>'],
            ['<%= files.spec.src %>']
        ]
    };
};
