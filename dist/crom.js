var pkg;

pkg = function(packageName) {
  var obj, path, ref;
  ref = [packageName.split('.'), window], path = ref[0], obj = ref[1];
  _(path).each(function(pe) {
    return obj = (obj[pe] || (obj[pe] = {}));
  });
  return obj;
};var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

pkg('Crom');

Crom.Model = (function(superClass) {
  extend(Model, superClass);

  function Model() {
    this._createNestedInstance = bind(this._createNestedInstance, this);
    this.nested = _(this).result('nested');
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
          var ref;
          return data[instanceName] = (ref = _this[instanceName]) != null ? ref.toJSON(options) : void 0;
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

})(Backbone.Model);var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

pkg('Crom');

Crom.Collection = (function(superClass) {
  extend(Collection, superClass);

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

})(Backbone.Collection);var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

pkg('Crom.Pagination');

Crom.Pagination.Model = (function(superClass) {
  extend(Model, superClass);

  Model.prototype.defaults = {
    total_count: 0,
    count: 0,
    current_page: 1,
    num_pages: 1,
    offset_value: 1
  };

  function Model(attributes, options) {
    this.collection = attributes.collection;
    delete attributes.collection;
    Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.initialize = function() {
    this.listenTo(this.collection, 'remove', this.itemRemoved);
    return this.listenTo(this.collection, 'add', this.itemAdded);
  };

  Model.prototype.itemRemoved = function() {
    return this.set('total_count', this.totalCount() - 1);
  };

  Model.prototype.itemAdded = function() {
    return this.set('total_count', this.totalCount() + 1);
  };

  Model.prototype.totalCount = function() {
    return this.get('total_count') || 0;
  };

  Model.prototype.currentPage = function() {
    return this.get('current_page') || 1;
  };

  Model.prototype.lastPage = function() {
    return this.get('num_pages');
  };

  Model.prototype.isFirstPage = function() {
    return this.currentPage() === 1;
  };

  Model.prototype.isLastPage = function() {
    return this.currentPage() >= this.lastPage();
  };

  Model.prototype.nextPage = function() {
    if (!this.isLastPage()) {
      return this.set('current_page', this.currentPage() + 1);
    }
  };

  Model.prototype.prevPage = function() {
    if (!this.isFirstPage()) {
      return this.set('current_page', this.currentPage() - 1);
    }
  };

  return Model;

})(Backbone.Model);var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

pkg('Crom.Pagination');

Crom.Pagination.Collection = (function(superClass) {
  extend(Collection, superClass);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
  }

  Collection.prototype.initialize = function() {
    this.pagination = new Crom.Pagination.Model({
      collection: this
    });
    return Collection.__super__.initialize.apply(this, arguments);
  };

  Collection.prototype.parse = function(resp) {
    this.pagination.set(resp.pagination);
    return this._prepareResponse(resp);
  };

  Collection.prototype.fetchNextPage = function(options) {
    if (options == null) {
      options = {};
    }
    if (this.pagination.nextPage() != null) {
      return this.fetch(options);
    }
  };

  Collection.prototype.fetchPrevPage = function(options) {
    if (options == null) {
      options = {};
    }
    if (this.pagination.prevPage() != null) {
      return this.fetch(options);
    }
  };

  Collection.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    options.data || (options.data = {});
    _(options.data).extend({
      page: this.pagination.currentPage()
    });
    return Collection.__super__.fetch.call(this, options);
  };

  Collection.prototype._prepareResponse = function(resp) {
    var value;
    delete resp.pagination;
    if (_(resp).size() === 1) {
      value = _(resp).values()[0];
      if (typeof value === 'object') {
        resp = value;
      }
    }
    return resp;
  };

  return Collection;

})(Crom.Collection);
;


