module.exports = {
    git: {
        command: [
            'git add .',
            'git commit -m "chore(release): Release v<%= pkg.version %>"',
            'git tag -a v<%= pkg.version %> -m "v<%= pkg.version %>"',
        ].join('&&'),
        options: {
            stdout: true
        }
    },
    git_bower: {
        command: [
            'git add .',
            'git commit -m "Updated to v<%= pkg.version %>"',
            'git tag -a v<%= pkg.version %> -m "v<%= pkg.version %>"'
        ].join('&&'),
        options: {
            stdout: true,
            execOptions: { cwd: '<%= bowerDirectory %>' }
        }
    },
    git_website: {
        command: [
            'git add .',
            'git commit -m "Updated to v<%= pkg.version %>"'
        ].join('&&'),
        options: {
            stdout: true,
            execOptions: { cwd: '<%= websiteDirectory %>' }
        }
    }
};