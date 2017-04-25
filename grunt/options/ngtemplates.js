module.exports = {
    build: {
        files: {
            '<%= files.html.out %>': ['<%= files.html.src %>']
        },
        options: {
            url(url) {
                return `ngTagsInput/${url.replace('templates/', '')}`;
            },
            bootstrap(module, script) {
                script = script.replace(/'use strict';\n\n/g, '').replace(/\n\n\s*\n/g, '\n');
                return `/*@ngInject*/\nexport default function TemplateCacheRegister($templateCache) {\n${script}}`;
            },
            htmlmin: {
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        }
    }
};