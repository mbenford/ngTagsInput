'use strict';

var Package = require('dgeni').Package;

module.exports = new Package('dgeni-example', [
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/nunjucks')
])
.config(function(log, readFilesProcessor, writeFilesProcessor, templateFinder, templateEngine) {
    var basePath = process.cwd();

    log.level = 'error';

    readFilesProcessor.basePath = basePath;
    readFilesProcessor.sourceFiles = [{
        include: [
            'src/tags-input.js',
            'src/auto-complete.js',
            'src/configuration.js'
        ],
        basePath: 'src'
    }];

    // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
    templateEngine.config.tags = {
        variableStart: '{$',
        variableEnd: '$}'
    };

    templateFinder.templateFolders.unshift(basePath + '/docs/templates');
    templateFinder.templatePatterns.unshift('${ doc.docType }.html');

    writeFilesProcessor.outputFolder  = 'build/docs';
});
