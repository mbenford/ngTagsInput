module.exports = grunt => {
  let coverageFile = grunt.file.expand('coverage/json/coverage-final.json')[0];
  return {
    build: {
      src: coverageFile,
      options: {
        reports: {
          html: 'coverage/html-report',
          json: coverageFile
        }
      }
    }
  };
};
