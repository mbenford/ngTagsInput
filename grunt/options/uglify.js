module.exports = {
  build: {
    options: {
      banner: '<%= banners.minified %>',
      sourceMap: true,
    },
    files: {
      '<%= files.js.outMin %>': ['<%= files.js.out %>']
    }
  }
};