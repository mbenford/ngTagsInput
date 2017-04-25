const includePaths = require('rollup-plugin-includepaths');
const babel = require('rollup-plugin-babel');

module.exports = {
  options: {
    format: 'iife',
    globals: {
      angular: 'angular'
    },
    indent: false,
    sourceMap: true,
    banner: '<%= banners.unminified %>',
    plugins: [
      includePaths({
        paths: ['build/tmp']
      }),
      babel({
        presets: [['es2015', { modules: false }]],
        plugins: [
          'external-helpers',
          ['angularjs-annotate', { explicitOnly: true }]
        ]
      }),
    ]
  },
  build: {
    files: {
      '<%= files.js.out %>': ['<%= files.js.src %>']
    }
  }
};
