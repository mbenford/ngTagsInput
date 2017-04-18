'use strict';

module.exports = {
    ngTagsInput: {
        files: {
            '<%= files.html.out %>': ['<%= files.html.src %>']
        },
        options: {
            url(url) {
                return `ngTagsInput/${url.replace('templates/', '')}`;
            },
            bootstrap(module, script) {
                return `/* HTML templates */\ntagsInput.run(function($templateCache) {\n${script}});\n`;
            },
            htmlmin: {
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        }
    }
};