/* jshint globalstrict: false */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Sets all files used by the script
        files: {
            js: {
                src: [
                    'src/keycodes.js',
                    'src/init.js',
                    'src/tags-input.js',
                    'src/auto-complete.js',
                    'src/transclude-append.js',
                    'src/autosize.js',
                    'src/configuration.js'
                ],
                out: 'build/<%= pkg.name %>.js',
                outMin: 'tmp/<%= pkg.name %>.min.js'
            },
            css: {
                src: ['css/tags-input.css', 'css/autocomplete.css'],
                out: 'build/<%= pkg.name %>.css',
                outMin: 'tmp/<%= pkg.name %>.min.css'
            },
            html: {
                src: ['templates/tags-input.html', 'templates/auto-complete.html'],
                out: 'tmp/templates.js'
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
            files: ['Gruntfile.js', ['<%= files.js.src %>'], ['<%= files.spec.src %>']],
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
                browsers: ['PhantomJS'],
                reporters: ['progress', 'coverage']
            }
        },
        // Sends coverage information to Coveralls
        coveralls: {
            options: {
                debug: true,
                coverage_dir: 'coverage'
            }
        },
        // Opens the coverage report
        open: {
            coverage: {
                path: grunt.file.expand('coverage/**/lcov-report/index.html')[0]
            }
        },
        // Cleans the build folder
        clean: {
            build: ['build/'],
            tmp: ['tmp/']
        },
        // Compiles the HTML templates into a Javascript file
        ngtemplates: {
            ngTagsInput: {
                files: {
                    '<%= files.html.out %>': ['<%= files.html.src %>']
                },
                options: {
                    url: function(url) {
                        return 'ngTagsInput/' + url.replace('templates/', '');
                    },
                    bootstrap: function(module, script) {
                        return '/* HTML templates */\n' +
                               'tagsInput.run(function($templateCache) {\n' + script + '});\n';
                    },
                    htmlmin: {
                        collapseWhitespace: true,
                        removeRedundantAttributes: true
                    }
                }
            }
        },
        // Concatenates all source files into one JS file and one CSS file
        concat: {
            js: {
                options: {
                    banner: '(function() {\n\'use strict\';\n\n',
                    footer: '\n}());',
                    separator: '\n\n',
                    process: function(src) {
                        // Remove all 'use strict'; from the code and
                        // replaces all double blank lines with one
                        return src.replace(/'use strict';\n+/g, '')
                                  .replace(/\n\n\s*\n/g, '\n\n');
                    }
                },
                files: {
                    '<%= files.js.out %>': ['<%= files.js.src %>', '<%= files.html.out %>']
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

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', [
        'jshint',
        'karma'
    ]);

    grunt.registerTask('travis', ['test', 'coveralls']);
    grunt.registerTask('coverage', ['test', 'open:coverage']);

    grunt.registerTask('pack', [
        'jshint',
        'karma',
        'clean',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'uglify',
        'cssmin',
        'compress',
        'clean:tmp'
    ]);

    grunt.registerTask('default', ['pack']);
};
