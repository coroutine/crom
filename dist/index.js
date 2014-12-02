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
    _(value != null ? value.match(URL.matcher) : void 0).chain().rest().zip(URL.parts).each((function(_this) {
      return function(_arg) {
        var part, val;
        val = _arg[0], part = _arg[1];
        return _this[part] = val;
      };
    })(this)).value();
  }

  URL.prototype.clone = function() {
    return _(new URL()).tap((function(_this) {
      return function(url) {
        return _(URL.parts).each(function(part) {
          return url[part] = _this[part];
        });
      };
    })(this));
  };

  URL.prototype.merge = function(url) {
    var copy;
    copy = this.clone();
    if (_(url).isString()) {
      url = new URL(url);
    }
    _(url).chain().pick(URL.parts).each((function(_this) {
      return function(val, part) {
        if (val != null) {
          return copy[part] = val;
        }
      };
    })(this)).value();
    return copy;
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

})();var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pkg('Crom');

Crom.Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this._createNestedInstance = __bind(this._createNestedInstance, this);
    _(this.nested).each(this._createNestedInstance);
    Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.set = function(key, val, options) {
    attrs;
    var attrs;
    if (key === null || key === void 0) {
      return this;
    }
    if (typeof key === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }
    _(this.nested).each(this._setNestedInstances(attrs));
    return Model.__super__.set.call(this, attrs, options);
  };

  Model.prototype.duplicate = function() {
    return _(new this.constructor(_(this.attributes).omit('id'))).tap(function(dup) {
      return _(dup.nested).each(function(ModelClass, instanceName) {
        return dup[instanceName] = dup[instanceName].duplicate();
      });
    });
  };

  Model.prototype.toJSON = function(options) {
    return _(Model.__super__.toJSON.call(this, options)).tap((function(_this) {
      return function(data) {
        data._cid = _this.cid;
        return _(_this.nested).each(function(ModelClass, instanceName) {
          var _ref;
          return data[instanceName] = (_ref = _this[instanceName]) != null ? _ref.toJSON(options) : void 0;
        });
      };
    })(this));
  };

  Model.prototype.sync = function(method, model, options) {
    var wrap, wrapper;
    wrap = _.result(model, 'wrapWith');
    if (typeof wrap === 'string') {
      wrapper = {};
      wrapper[wrap] = model.toJSON(options);
      options.attrs = wrapper;
    }
    return Model.__super__.sync.call(this, method, model, options);
  };

  Model.prototype._createNestedInstance = function(ModelClass, instanceName) {
    var alias, klass, options;
    if (this._isBackboneDataStructure(ModelClass)) {
      return this[instanceName] = new ModelClass();
    } else if (ModelClass.hasOwnProperty('alias')) {
      options = ModelClass;
      klass = options['class'];
      alias = options['alias'];
      if (!klass) {
        throw 'A "class" attribute must be defined when using "alias".';
      }
      return this[alias] = this[instanceName] = new klass();
    }
  };

  Model.prototype._setNestedInstances = function(attrs) {
    return (function(_this) {
      return function(ModelClass, instanceName) {
        var nestedModel, newVal;
        if (!_this._isBackboneDataStructure(ModelClass)) {
          ModelClass = ModelClass['class'];
        }
        newVal = attrs[instanceName];
        if (newVal === void 0) {
          return;
        }
        nestedModel = _this[instanceName];
        if (!(nestedModel instanceof ModelClass)) {
          throw "An attribute named '" + instanceName + "' already exists on the model.";
        }
        if (newVal === null) {
          return nestedModel.clear();
        } else if (typeof newVal === 'object') {
          return (typeof nestedModel.reset === "function" ? nestedModel.reset(newVal) : void 0) || nestedModel.set(newVal);
        } else {
          throw "The value provided for '" + instanceName + "' must be an object";
        }
      };
    })(this);
  };

  Model.prototype._isBackboneDataStructure = function(klass) {
    var proto;
    proto = klass.prototype;
    return proto instanceof Backbone.Model || proto instanceof Backbone.Collection;
  };

  return Model;

})(Backbone.Model);var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pkg('Crom');

Crom.Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
  }

  Collection.prototype.duplicate = function() {
    var models;
    models = _(this.models).map(function(model) {
      return model.duplicate();
    });
    return new this.constructor(models);
  };

  return Collection;

})(Backbone.Collection);
;


