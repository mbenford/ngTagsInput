module.exports = {
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
};