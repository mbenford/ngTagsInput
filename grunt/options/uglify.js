module.exports = {
    build: {
        options: {
            banner: '<%= banners.minified %>'
        },
        files: {
            '<%= files.js.outMin %>': ['<%= files.js.out %>']
        }
    }
};