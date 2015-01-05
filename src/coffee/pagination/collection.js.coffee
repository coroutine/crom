#= require collection
#= require pagination/model

pkg 'Crom.Pagination'

class Crom.Pagination.Collection extends Crom.Collection

  initialize: ->
    @pagination = new Crom.Pagination.Model({ collection: this })
    super

  parse: (resp) ->
    @pagination.set resp.pagination
    @_prepareResponse(resp)

  fetchNextPage: (options={}) ->
    @fetch(options) if @pagination.nextPage()?

  fetchPrevPage: (options={}) ->
    @fetch(options) if @pagination.prevPage()?

  fetch: (options={}) ->
    options.data ||= {}
    _(options.data).extend page: @pagination.currentPage()
    super options

  _prepareResponse: (resp) ->
    delete resp.pagination
    # flatten the response
    if _(resp).size() == 1
      value = _(resp).values()[0]
      resp  = value if typeof value == 'object'

    resp
