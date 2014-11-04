# ------------------------------------------------------------------------------
# pkg - defines a namespace
# ------------------------------------------------------------------------------

pkg = (packageName) ->
  [path, obj] = [packageName.split('.'), window]
  _(path).each (pe) -> obj = (obj[pe] ||= {})
  obj

# ------------------------------------------------------------------------------
# def_mixin - used to define a mixin
# ------------------------------------------------------------------------------

Mixable =
  includeIn: (receiver, args...) ->
    @onInclude ||= @mixables.onInclude
    delete @mixables['onInclude']

    _(receiver).extend(@utils, @mixables)
    @onInclude?.apply receiver, args

  utils:

    # A reference to the pre-mixin target.  Synonymous with 'super' in
    # a classical inheritance model.
    __receiver__: -> @constructor.prototype

    # Any instance variables set within a mixin definition should
    # be set within the __locals__ namespace.  These are variables
    # that are local to the mixin.  This protects us against redefining
    # variables on the mixin's receiver
    __locals__: -> {}

def_mixin = (name, props) ->
  base = pkg(name)
  _(base).extend(Mixable)

  base.mixables = props

# ------------------------------------------------------------------------------
# URL utility class
# ------------------------------------------------------------------------------

class URL
  @matcher: ///^
    (?:(.*?):\/{1,3})?            # protocol
    (?:([^\s:]+)?:([^\s:]+)?@)?   # username & password
    ([a-z0-9\.-]+)?               # host
    (?:\:(\d+))?                  # port
    (\/[^?#\s]+)?                 # path
    (?:\?([^#\s]+))?              # query
    (?:(#[a-z0-9_.-]+))?          # anchor
  ///i

  @parts:   ['protocol', 'username', 'password', 'host', 'port', 'path', 'query', 'anchor']
  @dataURLMatcher: /^data:[\w\/]+?;base64,/g

  # Creates a Data URL.  If dataString is already a data url, we return it,
  # as is.  Otherwise, a new data url is created with the given content type
  # and a base64 encoded dataString.
  @dataURL: (contentType, dataString) ->
    return dataString if dataString?.match(@dataURLMatcher)
    "data:#{contentType};base64,#{dataString}"

  constructor: (value) ->
    self = this

    _(value?.match(URL.matcher)).chain()
      .rest()
      .zip(URL.parts)
      .each(([val, part]) -> self[part] = val)
      .value()

  # Merge the attributes of another URL object into this.  Chainable
  merge: (url) ->
    _(url).chain()
      .pick(URL.parts)
      .each((val, part) => this[part] = val if val?)
      .value()

    this

  # Set a URL part to the specified value.  Chainable
  set: (part, value) ->
    throw "#{part} is not a valid URL part" unless this.hasOwnProperty(part)
    this[part] = value
    this

  toString: ->
    hasCredentials  = @username? || @password?

    protocol    = "#{@protocol}://"                     if @protocol?
    credentials = "#{@username||''}:#{@password||''}@"  if hasCredentials
    port        = ":#{@port}"                           if @port?
    query       = "?#{@query}"                          if @query?

    [protocol, credentials, @host, port, @path, query, @anchor].join('')
