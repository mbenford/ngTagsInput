module.exports = {
    bower: {
        files: [{
            expand: true,
            flatten: true,
            src: ['build/*.js', 'build/*.css'],
            dest: '<%= bowerDirectory %>',
            filter: 'isFile'
        }]
    }
};