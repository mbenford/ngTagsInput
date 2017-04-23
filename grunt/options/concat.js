module.exports = {
    js: {
        options: {
            stripBanners: true,
            banner: '<%= banners.unminified %>\n' +
                '(function() {\n\'use strict\';\n\n',
            footer: '\n}());',
            separator: '\n\n',
            process(src) {
                // Remove all 'use strict'; from the code and
                // replaces all double blank lines with one
                return src.replace(/'use strict';\n+/g, '')
                          .replace(/\n\n\s*\n/g, '\n\n');
            }
        },
        files: {
            '<%= files.js.out %>': ['<%= files.js.src %>', '<%= files.html.out %>']
        }
    }
};