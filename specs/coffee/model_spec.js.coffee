# ------------------------------------------------------------------------------
# Basic Defs for Test
# ------------------------------------------------------------------------------
class TestCollection extends Crom.Collection
  model: Crom.Model

class TestModel extends Crom.Model
  defaults:
    name: null
    site: null

  nested:
    songs: TestCollection
    label: Crom.Model

# ------------------------------------------------------------------------------
# Spec
# ------------------------------------------------------------------------------

describe 'Crom.Model', ->
  model = null
  data  =
    name: "Peter Cetera"
    site: 'petercetera.com'

    songs: [
      { name: 'Glory of Love', year: 1986 }
      { name: 'The Next Time I Fall', year: 1986 }
    ],
    label: { name: 'Warner Bros.', site: 'warnerbrosrecords.com' }

  beforeEach ->
    model = new TestModel(data)

  it 'should extend Backbone.Model', ->
    expect(model instanceof Backbone.Model).toBeTruthy()

  # ----------------------------------------------------------------------------
  # #set
  # ----------------------------------------------------------------------------

  describe '#set', ->

    describe 'when provided a basic hash of attrs', ->
      name    = 'Thoth Amon'
      result  = null

      beforeEach ->
        attrs = { name: name }
        model.set(attrs)

        result = model.get('name')

      it 'should set the model name attr', ->
        expect(result).toEqual(name)

    describe 'when provide a hash with a nested structure', ->

      describe 'when the structure is singular', ->
        name    = 'Puba Records'
        site    = 'grandpu.com'
        result  = null

        beforeEach ->
          attrs   = { label: { name: name, site: site } }
          model.set(attrs)

          result  = model.label

        it 'should be an instance of Crom.Model', ->
          expect(result instanceof Crom.Model).toBeTruthy()

        it 'should set the nested name attribute', ->
          expect(result.get('name')).toEqual(name)

        it 'should set the nested site attribute', ->
          expect(result.get('site')).toEqual(site)

      describe 'when the structure is a collection', ->
        result  = null

        beforeEach ->
          attrs = { songs: [
            { name: 'foo', year: 2000 },
            { name: 'bar', year: 3000 }
          ] }
          model.set(attrs)

          result = model.songs

        it 'should be an instance of Backbone.Collection', ->
          expect(result instanceof Backbone.Collection).toBeTruthy()

  # ----------------------------------------------------------------------------
  # #duplicate
  # ----------------------------------------------------------------------------

  describe '#duplicate', ->
    result = null

    beforeEach ->
      result = model.duplicate()

    it 'should not be a reference to the duplicated model', ->
      expect(result).not.toBe(model)

    it 'should have matching attributes', ->
      expect(result.attributes).toEqual(model.attributes)
