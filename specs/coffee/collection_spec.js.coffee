# ------------------------------------------------------------------------------
# Basic Defs for Test
# ------------------------------------------------------------------------------
class TestCollection extends Crom.Collection
  model: Crom.Model

# ------------------------------------------------------------------------------
# Spec
# ------------------------------------------------------------------------------

describe 'Crom.Collection', ->
  collection = null

  beforeEach ->
    collection = new TestCollection()

  it 'should extend Backbone.Collection', ->
    expect(collection instanceof Backbone.Collection).toBeTruthy()

  describe '#duplicate', ->
    result = null

    beforeEach ->
      models = [ { name: 'foo', age: 32 }, { name: 'bar', age: 99 } ]
      collection.reset(models)

      result = collection.duplicate()

    it 'should not be a reference to the original collection', ->
      expect(result).not.toBe(collection)

    it 'should have matching model attributes', ->
      resultAttrs     = result.models.map (m) -> m.attributes
      collectionAttrs = collection.models.map (m) -> m.attributes

      expect(resultAttrs).toEqual(collectionAttrs)
