pkg 'Crom'

class Crom.Collection extends Backbone.Collection

  duplicate: ->
    models = _(@models).map (model) -> model.duplicate()
    new @constructor(models)
