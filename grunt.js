/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      name: 'lightMock.js',
      version: '0.5.0',
      banner: '/*! <%= meta.name %> - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/JoeDoyle23/lightMock.js\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Joe Doyle; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/lightMock.js', 'tests/**/*.js']
    },
	docs: {
      all: ['README.md', 'docs/*.md']
	},
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/lightMock.js>'],
        dest: 'dist/lightMock.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/lightMock.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
		ok: false
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint test concat min');

};
