pkg 'Crom'

class Crom.Model extends Backbone.Model

  constructor: ->
    _(@nested).each @_createNestedInstance
    super

  set: (key, val, options) ->
    attrs
    return this if key == null || key == undefined

    if typeof key == 'object'
      attrs   = key
      options = val
    else
      (attrs = {})[key] = val

    _(@nested).each @_setNestedInstances(attrs)
    super(attrs, options)

  duplicate: ->
    _(new @constructor(_(@attributes).omit('id'))).tap (dup) ->
      _(dup.nested).each (ModelClass, instanceName) ->
        dup[instanceName] = dup[instanceName].duplicate()

  toJSON: (options) ->
    _(super(options)).tap (data) =>
      # add _cid for error message linking.
      data._cid = @cid

      # Add nested instance as JSON
      _(@nested).each (ModelClass, instanceName) =>
        data[instanceName] = this[instanceName]?.toJSON(options)

  sync: (method, model, options) ->
    wrap = _.result(model, 'wrapWith')
    if typeof wrap == 'string'
      wrapper        = {}
      wrapper[wrap]  = model.toJSON(options)
      options.attrs  = wrapper

    super(method, model, options)

  _createNestedInstance: (ModelClass, instanceName) =>
    if @_isBackboneDataStructure(ModelClass)
      this[instanceName] = new ModelClass()
    else if ModelClass.hasOwnProperty('alias')
      options   = ModelClass
      klass     = options['class']
      alias     = options['alias']
      throw 'A "class" attribute must be defined when using "alias".' unless klass

      this[alias] = this[instanceName] = new klass()

  _setNestedInstances: (attrs) ->
    (ModelClass, instanceName) =>
      ModelClass = ModelClass['class'] unless @_isBackboneDataStructure(ModelClass)

      newVal = attrs[instanceName]
      return if newVal == undefined

      nestedModel = this[instanceName]
      unless nestedModel instanceof ModelClass
        throw "An attribute named '#{instanceName}' already exists on the model."

      if newVal == null
        nestedModel.clear()
      else if typeof newVal == 'object'
        nestedModel.reset?(newVal) || nestedModel.set(newVal)
      else
        throw "The value provided for '#{instanceName}' must be an object"

  _isBackboneDataStructure: (klass) ->
    proto = klass.prototype
    proto instanceof Backbone.Model ||
    proto instanceof Backbone.Collection
