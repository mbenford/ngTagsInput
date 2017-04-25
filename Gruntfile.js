module.exports = grunt => {
    function loadConfig(path) {
        let glob = require('glob');
        let object = {};

        glob.sync('*', { cwd: path }).forEach(option => {
            let key = option.replace(/\.js$/, '');
            let data = require(path + option);
            object[key] = typeof data === 'function' ? data(grunt) : data;
        });

        return object;
    }

    const config = {
        pkg: grunt.file.readJSON('package.json'),
        bowerDirectory: '../ngTagsInput-bower',
        bowerFile: '<%= bowerDirectory %>/bower.json',
        websiteDirectory: '../ngTagsInput-website',
        websiteConfigFile: '<%= websiteDirectory %>/_config.yml',

        files: {
            js: {
                src: 'src/init.js',
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
                src: 'templates/*.html',
                out: 'build/tmp/compiled-templates.js'
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
            unminified:
`/*!
* <%= pkg.prettyName %> v<%= pkg.version %>
* <%= pkg.homepage %>
*
* Copyright (c) 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>
* License: <%= pkg.license %>
*
* Generated at <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>
*/`,
            minified: '/*! <%= pkg.prettyName %> v<%= pkg.version %> License: <%= pkg.license %> */'
        }
    };

    grunt.util._.extend(config, loadConfig('./grunt/options/'));
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('grunt/tasks');

    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['lint', 'clean', 'ngtemplates', 'rollup', 'karma:local']);
    grunt.registerTask('coverage', ['test', 'open:coverage']);
    grunt.registerTask('docs', ['clean:build', 'dgeni']);
    grunt.registerTask('travis', ['pack', 'compress', 'copy:travis', 'coveralls']);
    grunt.registerTask('javascript-only', ['test', 'uglify']);
    grunt.registerTask('css-only', ['sass', 'cssmin']);
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
