module.exports = {
    build: {
        files: {
            '<%= files.css.outMin %>': ['<%= files.css.out %>']
        }
    }
};