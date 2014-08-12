module.exports = {
    build: {
        files: {
            '<%= files.css.main.outMin %>': ['<%= files.css.main.out %>'],
            '<%= files.css.bootstrap.outMin %>': ['<%= files.css.bootstrap.out %>']
        }
    }
};