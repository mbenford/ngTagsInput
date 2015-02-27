module.exports = {
    changelog: {
        src: ['CHANGELOG.md'],
        overwrite: true,
        replacements: [
            { from: ', closes [', to: ', [' },
            { from: /\n\n\s*\n/g, to: '\n\n' },
            { from: /<a.*\/a>\n/g, to: '' }
        ]
    }
};