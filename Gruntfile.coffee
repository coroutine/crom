module.exports = (grunt) ->

  grunt.initConfig

    mince:
      dist:
        src:  'src/coffee/index.js.coffee'
        dest: 'dist/crom.js'

      specs:
        src:  'specs/coffee/index.js.coffee'
        dest: 'specs/index.js'

    watch:
      dist:
        files: 'src/coffee/**/*.coffee'
        tasks: ['mince:dist', 'karma:ci']

      specs:
        files: 'specs/coffee/**/*.coffee'
        tasks: ['mince:specs', 'karma:ci']

    karma:
      options:
        configFile: 'karma.conf.coffee'
      unit:
        background: true
      ci:
        singleRun:  true

  grunt.loadNpmTasks  'grunt-mincer'
  grunt.loadNpmTasks  'grunt-contrib-watch'
  grunt.loadNpmTasks  'grunt-karma'

  grunt.registerTask 'default', ['mince']
