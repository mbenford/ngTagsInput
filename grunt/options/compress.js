module.exports = {
  options: {
    mode: 'zip'
  },
  minified: {
    options: {
      archive: '<%= files.zip.minified %>'
    },
    files : [
      {
        expand: true,
        src : [
          '<%= files.js.outMin %>',
          '<%= files.js.outMin %>.map',
          '<%= files.css.main.outMin %>',
          '<%= files.css.bootstrap.outMin %>'
        ],
        flatten: true
      }
    ]
  },
  unminified: {
    options: {
      archive: '<%= files.zip.unminified %>'
    },
    files : [
      {
        expand: true,
        src : [
          '<%= files.js.out %>',
          '<%= files.js.out %>.map',
          '<%= files.css.main.out %>',
          '<%= files.css.bootstrap.out %>'
        ],
        flatten: true
      }
    ]
  },
  npm: {
    options: {
      archive: '<%= files.tgz.npm %>',
      mode: 'tgz'
    },
    files : [
      {
        expand: true,
        src : [
          '<%= files.js.out %>',
          '<%= files.js.out %>.map',
          '<%= files.css.main.out %>',
          '<%= files.css.bootstrap.out %>',
          '<%= files.js.outMin %>.map',
          '<%= files.css.main.outMin %>',
          '<%= files.css.bootstrap.outMin %>',
        ],
        dest: 'package/build',
        flatten: true
      },
      {
        expand: true,
        src: [
          'README.md',
          'package.json'
        ],
        dest: 'package/',
        flatten: true
      },

    ]
  }
};