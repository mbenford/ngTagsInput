module.exports = grunt => {
  grunt.registerTask('pack', output => {
    let tasks = [];

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
