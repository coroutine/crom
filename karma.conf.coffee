module.exports = (config) ->
  config.set
    basePath:   '.'
    plugins:    ['karma-jasmine', 'karma-phantomjs-launcher']
    frameworks: ['jasmine']
    browsers:   ['PhantomJS']
    reporters:  ['dots']
    files:      [
      'node_modules/underscore/underscore.js'
      'node_modules/backbone/backbone.js'
      'dist/crom.js'
      'specs/index.js'
    ]
