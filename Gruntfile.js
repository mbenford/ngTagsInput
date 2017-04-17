'use strict';

module.exports = function(grunt) {
    function loadConfig(path) {
        var glob = require('glob'),
            object = {};

        glob.sync('*', { cwd: path }).forEach(function(option) {
            var key = option.replace(/\.js$/,''),
                data = require(path + option);
            object[key] = typeof data === 'function' ? data(grunt) : data;
        });

        return object;
    }

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        bowerDirectory: '../ngTagsInput-bower',
        bowerFile: '<%= bowerDirectory %>/bower.json',
        websiteDirectory: '../ngTagsInput-website',
        websiteConfigFile: '<%= websiteDirectory %>/_config.yml',

        files: {
            js: {
                src: [
                    'src/constants.js',
                    'src/init.js',
                    'src/tags-input.js',
                    'src/tag-item.js',
                    'src/auto-complete.js',
                    'src/auto-complete-match.js',
                    'src/transclude-append.js',
                    'src/autosize.js',
                    'src/bind-attrs.js',
                    'src/configuration.js',
                    'src/util.js'
                ],
                out: 'build/<%= pkg.name %>.js',
                outMin: 'build/<%= pkg.name %>.min.js'
            },
            css: {
                main: {
                    src: 'scss/main.scss',
                    out: 'build/<%= pkg.name %>.css',
                    outMin: 'build/<%= pkg.name %>.min.css'
                },
                bootstrap: {
                    src: 'scss/bootstrap/main.scss',
                    out: 'build/<%= pkg.name %>.bootstrap.css',
                    outMin: 'build/<%= pkg.name %>.bootstrap.min.css'
                }
            },
            html: {
                src: [
                    'templates/tags-input.html',
                    'templates/tag-item.html',
                    'templates/auto-complete.html',
                    'templates/auto-complete-match.html'
                ],
                out: 'tmp/templates.js'
            },
            zip: {
                unminified: 'build/<%= pkg.name %>.zip',
                minified: 'build/<%= pkg.name %>.min.zip'
            },
            tgz: {
                npm: 'build/<%= pkg.name %>.tgz'
            },
            spec: {
                src: 'test/*.spec.js'
            }
        },
        banners: {
            unminified: '/*!\n' +
                ' * <%= pkg.prettyName %> v<%= pkg.version %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * License: <%= pkg.license %>\n' +
                ' *\n' +
                ' * Generated at <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>\n' +
                ' */',
            minified: '/*! <%= pkg.prettyName %> v<%= pkg.version %> License: <%= pkg.license %> */'
        }
    };

    grunt.util._.extend(config, loadConfig('./grunt/options/'));
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('grunt/tasks');

   // grunt.registerTask('test', ['jshint','karma:local']);
    grunt.registerTask('coverage', ['test', 'open:coverage']);
    grunt.registerTask('docs', ['clean:build', 'dgeni']);

    grunt.registerTask('travis', [
        'pack',
        'compress',
        'copy:travis',
        'coveralls'
    ]);

    grunt.registerTask('javascript-only', [
      //  'test',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('css-only', [
        'sass',
        'cssmin'
    ]);

    grunt.registerTask('release', [
        'pack',
        'compress',
        'changelog',
        'replace:changelog',
        'shell:git',
        'copy:bower',
        'update-bower-version',
        'shell:git_bower',
        'dgeni',
        'copy:website',
        'update-website-version',
        'shell:git_website'
    ]);

    grunt.registerTask('default', ['pack']);
};
