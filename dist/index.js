var Mixable, URL, def_mixin, pkg,
  __slice = [].slice;

pkg = function(packageName) {
  var obj, path, _ref;
  _ref = [packageName.split('.'), window], path = _ref[0], obj = _ref[1];
  _(path).each(function(pe) {
    return obj = (obj[pe] || (obj[pe] = {}));
  });
  return obj;
};

Mixable = {
  includeIn: function() {
    var args, receiver, _ref;
    receiver = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    this.onInclude || (this.onInclude = this.mixables.onInclude);
    delete this.mixables['onInclude'];
    _(receiver).extend(this.utils, this.mixables);
    return (_ref = this.onInclude) != null ? _ref.apply(receiver, args) : void 0;
  },
  utils: {
    __receiver__: function() {
      return this.constructor.prototype;
    },
    __locals__: function() {
      return {};
    }
  }
};

def_mixin = function(name, props) {
  var base;
  base = pkg(name);
  _(base).extend(Mixable);
  return base.mixables = props;
};

URL = (function() {
  URL.matcher = /^(?:(.*?):\/{1,3})?(?:([^\s:]+)?:([^\s:]+)?@)?([a-z0-9\.-]+)?(?:\:(\d+))?(\/[^?#\s]+)?(?:\?([^#\s]+))?(?:(#[a-z0-9_.-]+))?/i;

  URL.parts = ['protocol', 'username', 'password', 'host', 'port', 'path', 'query', 'anchor'];

  URL.dataURLMatcher = /^data:[\w\/]+?;base64,/g;

  URL.dataURL = function(contentType, dataString) {
    if (dataString != null ? dataString.match(this.dataURLMatcher) : void 0) {
      return dataString;
    }
    return "data:" + contentType + ";base64," + dataString;
  };

  function URL(value) {
    var self;
    self = this;
    _(value != null ? value.match(URL.matcher) : void 0).chain().rest().zip(URL.parts).each(function(_arg) {
      var part, val;
      val = _arg[0], part = _arg[1];
      return self[part] = val;
    }).value();
  }

  URL.prototype.merge = function(url) {
    _(url).chain().pick(URL.parts).each((function(_this) {
      return function(val, part) {
        if (val != null) {
          return _this[part] = val;
        }
      };
    })(this)).value();
    return this;
  };

  URL.prototype.set = function(part, value) {
    if (!this.hasOwnProperty(part)) {
      throw "" + part + " is not a valid URL part";
    }
    this[part] = value;
    return this;
  };

  URL.prototype.toString = function() {
    var credentials, hasCredentials, port, protocol, query;
    hasCredentials = (this.username != null) || (this.password != null);
    if (this.protocol != null) {
      protocol = "" + this.protocol + "://";
    }
    if (hasCredentials) {
      credentials = "" + (this.username || '') + ":" + (this.password || '') + "@";
    }
    if (this.port != null) {
      port = ":" + this.port;
    }
    if (this.query != null) {
      query = "?" + this.query;
    }
    return [protocol, credentials, this.host, port, this.path, query, this.anchor].join('');
  };

  return URL;

})();
;


