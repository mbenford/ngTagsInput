module.exports = {
    bower: {
        files: [{
            expand: true,
            flatten: true,
            src: ['build/*.js', 'build/*.css'],
            dest: '<%= bowerDirectory %>',
            filter: 'isFile'
        }]
    },
    travis: {
        files: [{
            expand: true,
            flatten: true,
            src: ['build/*.zip'],
            dest: 'build/travis',
            filter: 'isFile'
        }]
    },
    website: {
        files: [
            {
                expand: true,
                flatten: true,
                src: ['build/docs/**/*.html'],
                dest: '<%= websiteDirectory %>/_includes/api',
                filter: 'isFile'
            },
            {
                expand: true,
                flatten: true,
                src: ['build/*.min.js'],
                dest: '<%= websiteDirectory %>/js',
                filter: 'isFile'
            },
            {
                expand: true,
                flatten: true,
                src: ['build/*.min.css'],
                dest: '<%= websiteDirectory %>/css',
                filter: 'isFile'
            }
        ]
    }
};