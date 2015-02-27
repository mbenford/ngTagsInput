'use strict';

module.exports = {
    ngTagsInput: {
        files: {
            '<%= files.html.out %>': ['<%= files.html.src %>']
        },
        options: {
            url: function(url) {
                return 'ngTagsInput/' + url.replace('templates/', '');
            },
            bootstrap: function(module, script) {
                return '/* HTML templates */\n' +
                    'tagsInput.run(function($templateCache) {\n' + script + '});\n';
            },
            htmlmin: {
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        }
    }
};