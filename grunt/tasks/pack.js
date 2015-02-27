'use strict';

module.exports = function(grunt) {
    grunt.registerTask('pack', function(output) {
        var tasks = ['clean'];

        if (!output || output === 'js') {
            tasks.push('javascript-only');
        }
        if (!output || output === 'css') {
            tasks.push('css-only');
        }

        tasks.push('clean:tmp');

        grunt.task.run(tasks);
    });
};
