# ------------------------------------------------------------------------------
# Basic Defs for Test
# ------------------------------------------------------------------------------

class TestCollection extends Crom.Pagination.Collection
  model: Crom.Model

# ------------------------------------------------------------------------------
# Mock Response Generator
# ------------------------------------------------------------------------------
recordsPerPage    = 25

generateResponse  = (count) ->
  resp =
    pagination:
      total_count:  count
      count:        count
      current_page: 1
      total_pages:  Math.floor(count / recordsPerPage)
      offset_value: 1

  resp.collection = _(recordsPerPage).times (i) ->
    { id: i, name: "record_#{i}", age: (i * 2 + 11) % 22 }

  resp

# ------------------------------------------------------------------------------
# Spec
# ------------------------------------------------------------------------------

describe 'Crom.Pagination.Collection', ->
  collection  = null
  count       = 50

  beforeEach ->
    response    = generateResponse(count)
    collection  = new TestCollection()
    collection.reset(response, parse: true)

  describe '#pagination', ->
    it 'should be an instance of Crom.Pagination.Model', ->
      expect(collection.pagination instanceof Crom.Pagination.Model).toBeTruthy()

    it "should have a count of #{count}", ->
      expect(collection.pagination.get('count')).toEqual(count)

    it "should have a total_count of #{count}", ->
      expect(collection.pagination.get('total_count')).toEqual(count)

    it "should have a current_page of 1", ->
      expect(collection.pagination.get('current_page')).toEqual(1)

    it "should have 2 pages", ->
      expect(collection.pagination.get('total_pages')).toEqual(2)

    it "should be on the first page", ->
      expect(collection.pagination.get('offset_value')).toEqual(1)

  describe '#length', ->
    it "should be #{recordsPerPage}", ->
      expect(collection.length).toBe(recordsPerPage)

  describe 'the fetch methods', ->

    beforeEach ->
      spyOn(Crom.Collection.prototype, 'fetch')

    describe '#fetch', ->

      beforeEach ->
        spyOn(collection, 'fetch').and.callThrough()
        collection.fetch()

      it 'should fetch the current page', ->
        expect(Crom.Collection::fetch).toHaveBeenCalledWith({ data: {page: 1} })

    describe '#fetchNextPage', ->

      describe 'when there is a next page', ->

        beforeEach ->
          spyOn(collection, 'fetchNextPage').and.callThrough()
          collection.fetchNextPage()

        it 'should fetch the next page', ->
          expect(Crom.Collection::fetch).toHaveBeenCalledWith({ data: {page: 2} })

      describe 'where there is not a next page', ->
        beforeEach ->
          response = generateResponse(5)
          collection.reset(response, parse: true)

          spyOn(collection, 'fetchNextPage').and.callThrough()
          collection.fetchNextPage()

        it 'should do nothing', ->
          expect(Crom.Collection::fetch).not.toHaveBeenCalled()

    describe '#fetchPrevPage', ->

      describe 'when there is a previous page', ->

        beforeEach ->
          collection.fetchNextPage()
          spyOn(collection, 'fetchPrevPage').and.callThrough()
          collection.fetchPrevPage()

        it 'should fetch the previous page', ->
          expect(Crom.Collection::fetch).toHaveBeenCalledWith({ data: {page: 1} })

      describe 'where there is not a previous page', ->

        beforeEach ->
          spyOn(collection, 'fetchPrevPage').and.callThrough()
          collection.fetchPrevPage()

        it 'should do nothing', ->
          expect(Crom.Collection::fetch).not.toHaveBeenCalled()
