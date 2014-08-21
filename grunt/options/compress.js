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
                src : [
                    '<%= files.js.outMin %>',
                    '<%= files.css.main.outMin %>',
                    '<%= files.css.bootstrap.outMin %>'
                ],
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
                src : [
                    '<%= files.js.out %>',
                    '<%= files.css.main.out %>',
                    '<%= files.css.bootstrap.out %>'
                ],
                flatten: true
            }
        ]
    }
};