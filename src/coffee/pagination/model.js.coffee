pkg 'Crom.Pagination'

class Crom.Pagination.Model extends Backbone.Model
  defaults:
    total_count:  0
    count:        0
    current_page: 1
    num_pages:    1
    offset_value: 1

  constructor: (attributes, options) ->
    @collection = attributes.collection
    delete attributes.collection
    super

  initialize: ->
    @listenTo @collection, 'remove',  @itemRemoved
    @listenTo @collection, 'add',     @itemAdded

  itemRemoved:  -> @set 'total_count', @totalCount() - 1
  itemAdded:    -> @set 'total_count', @totalCount() + 1
  totalCount:   -> @get('total_count') || 0
  currentPage:  -> @get('current_page') || 1

  lastPage:     -> @get('num_pages')
  isFirstPage:  -> @currentPage() == 1
  isLastPage:   -> @currentPage() >= @lastPage()
  nextPage:     -> @set('current_page', @currentPage() + 1) unless @isLastPage()
  prevPage:     -> @set('current_page', @currentPage() - 1) unless @isFirstPage()
