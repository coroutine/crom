module.exports = (config) ->
  config.set
    basePath:   '.'
    plugins:    ['karma-jasmine', 'karma-phantomjs-launcher']
    frameworks: ['jasmine']
    browsers:   ['PhantomJS']
    reporters:  ['dots']
    files:      [
      'bower_components/underscore/underscore.js'
      'bower_components/backbone/backbone.js'
      'dist/crom.js'
      'specs/index.js'
    ]
