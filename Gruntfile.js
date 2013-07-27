module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/<%= pkg.name %>.js', 'test/<%= pkg.name %>.spec.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                noempty: true,
                noarg: true,
                quotmark: 'single',
                undef: true,
                eqnull: true,
                globals: {
                    angular: true,
                    module: true,
                    inject: true,
                    jQuery: true,
                    beforeEach: true,
                    describe: true,
                    it: true,
                    expect: true,
                    spyOn: true
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        uglify: {
            dist: {
                files: {
                    'build/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'build/<%= pkg.name %>.min.css': ['src/<%= pkg.name %>.css']
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'karma']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['jshint', 'karma']);
    grunt.registerTask('default', ['jshint', 'karma', 'uglify', 'cssmin']);
};