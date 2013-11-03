module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Sets all files used by the script
        files: {
            js: {
                src: ['src/keycodes.js', 'src/tags-input.js', 'src/autocomplete.js'],
                out: 'build/<%= pkg.name %>.js',
                outMin: 'build/<%= pkg.name %>.min.js'
            },
            css: {
                src: ['src/tags-input.css', 'src/autocomplete.css'],
                out: 'build/<%= pkg.name %>.css',
                outMin: 'build/<%= pkg.name %>.min.css'
            },
            zip: {
                unminified: 'build/<%= pkg.name %>.zip',
                minified: 'build/<%= pkg.name %>.min.zip'
            },
            spec: {
                src: 'test/*.spec.js'
            }
        },
        // Validates the JS file with JSHint
        jshint: {
            files: ['Gruntfile.js', ['<%= files.js.out %>'], ['<%= files.spec.src %>']],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        // Runs all unit tests with Karma
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        // Cleans the build folder
        clean: {
            build: ['build/']
        },
        // Concats all source files into one JS file and one CSS file
        concat: {
            js: {
                options: {
                    banner: '(function() {\n\'use strict\';\n\n',
                    footer: '\n}());',
                    process: function(src) {
                        // Remove all (function() {'use strict'; and }()) from the code
                        return src.replace(/\(function\(\) \{\n'use strict';/g, '')
                            .replace(/\}\(\)\);/g, '');
                    }
                },
                files: {
                    '<%= files.js.out %>': ['<%= files.js.src %>']
                }
            },
            css: {
                files: {
                    '<%= files.css.out %>': ['<%= files.css.src %>']
                }
            }
        },
        // Adds AngularJS dependency injection annotations
        ngAnnotate: {
            directives: {
                files: {
                    '<%= files.js.out %>': ['<%= files.js.out %>']
                }
            }
        },
        // Minifies the JS file
        uglify: {
            build: {
                files: {
                    '<%= files.js.outMin %>': ['<%= files.js.out %>']
                }
            }
        },
        // Minifies the CSS file
        cssmin: {
            build: {
                files: {
                    '<%= files.css.outMin %>': ['<%= files.css.out %>']
                }
            }
        },
        // Packs the JS and CSS files in one ZIP file
        compress: {
            options: {
                mode: 'zip'
            },
            minified: {
                options: {
                    archive: '<%= files.zip.minified %>'
                },
                files : [
                    {
                        expand: true,
                        src : ['<%= files.js.outMin %>', '<%= files.css.outMin %>'],
                        flatten: true
                    }
                ]
            },
            unminified: {
                options: {
                    archive: '<%= files.zip.unminified %>'
                },
                files : [
                    {
                        expand: true,
                        src : ['<%= files.js.out %>', '<%= files.css.out %>'],
                        flatten: true
                    }
                ]
            }
        },
        // Watches the JS files for changes and runs unit tests
        watch: {
            files: ['<%= files.js.src %>'],
            tasks: ['test']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['jshint', 'karma']);
    grunt.registerTask('default', ['jshint', 'karma', 'clean', 'concat', 'ngAnnotate', 'uglify', 'cssmin', 'compress']);
};
