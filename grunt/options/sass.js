module.exports = {
    build: {
        options: {
            style: 'expanded',
            noCache: true
        },
        files: {
            '<%= files.css.out %>': ['<%= files.css.src %>']
        }
    }
};