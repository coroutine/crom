var TestCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TestCollection = (function(superClass) {
  extend(TestCollection, superClass);

  function TestCollection() {
    return TestCollection.__super__.constructor.apply(this, arguments);
  }

  TestCollection.prototype.model = Crom.Model;

  return TestCollection;

})(Crom.Collection);

describe('Crom.Collection', function() {
  var collection;
  collection = null;
  beforeEach(function() {
    return collection = new TestCollection();
  });
  it('should extend Backbone.Collection', function() {
    return expect(collection instanceof Backbone.Collection).toBeTruthy();
  });
  return describe('#duplicate', function() {
    var result;
    result = null;
    beforeEach(function() {
      var models;
      models = [
        {
          name: 'foo',
          age: 32
        }, {
          name: 'bar',
          age: 99
        }
      ];
      collection.reset(models);
      return result = collection.duplicate();
    });
    it('should not be a reference to the original collection', function() {
      return expect(result).not.toBe(collection);
    });
    return it('should have matching model attributes', function() {
      var collectionAttrs, resultAttrs;
      resultAttrs = result.models.map(function(m) {
        return m.attributes;
      });
      collectionAttrs = collection.models.map(function(m) {
        return m.attributes;
      });
      return expect(resultAttrs).toEqual(collectionAttrs);
    });
  });
});var TestCollection, TestModel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TestCollection = (function(superClass) {
  extend(TestCollection, superClass);

  function TestCollection() {
    return TestCollection.__super__.constructor.apply(this, arguments);
  }

  TestCollection.prototype.model = Crom.Model;

  return TestCollection;

})(Crom.Collection);

TestModel = (function(superClass) {
  extend(TestModel, superClass);

  function TestModel() {
    return TestModel.__super__.constructor.apply(this, arguments);
  }

  TestModel.prototype.defaults = {
    name: null,
    site: null
  };

  TestModel.prototype.nested = {
    songs: TestCollection,
    label: Crom.Model
  };

  return TestModel;

})(Crom.Model);

describe('Crom.Model', function() {
  var data, model;
  model = null;
  data = {
    name: "Peter Cetera",
    site: 'petercetera.com',
    songs: [
      {
        name: 'Glory of Love',
        year: 1986
      }, {
        name: 'The Next Time I Fall',
        year: 1986
      }
    ],
    label: {
      name: 'Warner Bros.',
      site: 'warnerbrosrecords.com'
    }
  };
  beforeEach(function() {
    return model = new TestModel(data);
  });
  it('should extend Backbone.Model', function() {
    return expect(model instanceof Backbone.Model).toBeTruthy();
  });
  describe('#set', function() {
    describe('when provided a basic hash of attrs', function() {
      var name, result;
      name = 'Thoth Amon';
      result = null;
      beforeEach(function() {
        var attrs;
        attrs = {
          name: name
        };
        model.set(attrs);
        return result = model.get('name');
      });
      return it('should set the model name attr', function() {
        return expect(result).toEqual(name);
      });
    });
    return describe('when provide a hash with a nested structure', function() {
      describe('when the structure is singular', function() {
        var name, result, site;
        name = 'Puba Records';
        site = 'grandpu.com';
        result = null;
        beforeEach(function() {
          var attrs;
          attrs = {
            label: {
              name: name,
              site: site
            }
          };
          model.set(attrs);
          return result = model.label;
        });
        it('should be an instance of Crom.Model', function() {
          return expect(result instanceof Crom.Model).toBeTruthy();
        });
        it('should set the nested name attribute', function() {
          return expect(result.get('name')).toEqual(name);
        });
        return it('should set the nested site attribute', function() {
          return expect(result.get('site')).toEqual(site);
        });
      });
      return describe('when the structure is a collection', function() {
        var result;
        result = null;
        beforeEach(function() {
          var attrs;
          attrs = {
            songs: [
              {
                name: 'foo',
                year: 2000
              }, {
                name: 'bar',
                year: 3000
              }
            ]
          };
          model.set(attrs);
          return result = model.songs;
        });
        return it('should be an instance of Backbone.Collection', function() {
          return expect(result instanceof Backbone.Collection).toBeTruthy();
        });
      });
    });
  });
  return describe('#duplicate', function() {
    var result;
    result = null;
    beforeEach(function() {
      return result = model.duplicate();
    });
    it('should not be a reference to the duplicated model', function() {
      return expect(result).not.toBe(model);
    });
    return it('should have matching attributes', function() {
      return expect(result.attributes).toEqual(model.attributes);
    });
  });
});var TestCollection, generateResponse, recordsPerPage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TestCollection = (function(superClass) {
  extend(TestCollection, superClass);

  function TestCollection() {
    return TestCollection.__super__.constructor.apply(this, arguments);
  }

  TestCollection.prototype.model = Crom.Model;

  return TestCollection;

})(Crom.Pagination.Collection);

recordsPerPage = 25;

generateResponse = function(count) {
  var resp;
  resp = {
    pagination: {
      total_count: count,
      count: count,
      current_page: 1,
      num_pages: Math.floor(count / recordsPerPage),
      offset_value: 1
    }
  };
  resp.collection = _(recordsPerPage).times(function(i) {
    return {
      id: i,
      name: "record_" + i,
      age: (i * 2 + 11) % 22
    };
  });
  return resp;
};

describe('Crom.Pagination.Collection', function() {
  var collection, count;
  collection = null;
  count = 50;
  beforeEach(function() {
    var response;
    response = generateResponse(count);
    collection = new TestCollection();
    return collection.reset(response, {
      parse: true
    });
  });
  describe('#pagination', function() {
    it('should be an instance of Crom.Pagination.Model', function() {
      return expect(collection.pagination instanceof Crom.Pagination.Model).toBeTruthy();
    });
    it("should have a count of " + count, function() {
      return expect(collection.pagination.get('count')).toEqual(count);
    });
    it("should have a total_count of " + count, function() {
      return expect(collection.pagination.get('total_count')).toEqual(count);
    });
    it("should have a current_page of 1", function() {
      return expect(collection.pagination.get('current_page')).toEqual(1);
    });
    it("should have 2 pages", function() {
      return expect(collection.pagination.get('num_pages')).toEqual(2);
    });
    return it("should be on the first page", function() {
      return expect(collection.pagination.get('offset_value')).toEqual(1);
    });
  });
  describe('#length', function() {
    return it("should be " + recordsPerPage, function() {
      return expect(collection.length).toBe(recordsPerPage);
    });
  });
  return describe('the fetch methods', function() {
    beforeEach(function() {
      return spyOn(Crom.Collection.prototype, 'fetch');
    });
    describe('#fetch', function() {
      beforeEach(function() {
        spyOn(collection, 'fetch').and.callThrough();
        return collection.fetch();
      });
      return it('should fetch the current page', function() {
        return expect(Crom.Collection.prototype.fetch).toHaveBeenCalledWith({
          data: {
            page: 1
          }
        });
      });
    });
    describe('#fetchNextPage', function() {
      describe('when there is a next page', function() {
        beforeEach(function() {
          spyOn(collection, 'fetchNextPage').and.callThrough();
          return collection.fetchNextPage();
        });
        return it('should fetch the next page', function() {
          return expect(Crom.Collection.prototype.fetch).toHaveBeenCalledWith({
            data: {
              page: 2
            }
          });
        });
      });
      return describe('where there is not a next page', function() {
        beforeEach(function() {
          var response;
          response = generateResponse(5);
          collection.reset(response, {
            parse: true
          });
          spyOn(collection, 'fetchNextPage').and.callThrough();
          return collection.fetchNextPage();
        });
        return it('should do nothing', function() {
          return expect(Crom.Collection.prototype.fetch).not.toHaveBeenCalled();
        });
      });
    });
    return describe('#fetchPrevPage', function() {
      describe('when there is a previous page', function() {
        beforeEach(function() {
          collection.fetchNextPage();
          spyOn(collection, 'fetchPrevPage').and.callThrough();
          return collection.fetchPrevPage();
        });
        return it('should fetch the previous page', function() {
          return expect(Crom.Collection.prototype.fetch).toHaveBeenCalledWith({
            data: {
              page: 1
            }
          });
        });
      });
      return describe('where there is not a previous page', function() {
        beforeEach(function() {
          spyOn(collection, 'fetchPrevPage').and.callThrough();
          return collection.fetchPrevPage();
        });
        return it('should do nothing', function() {
          return expect(Crom.Collection.prototype.fetch).not.toHaveBeenCalled();
        });
      });
    });
  });
});
;
describe('pkg', function() {
  describe('with a graph depth of one', function() {
    var result;
    result = pkg('foo');
    return it('should define `foo` package', function() {
      return expect(result).toBe(window.foo);
    });
  });
  return describe('with a graph depth greater than one', function() {
    var result;
    result = pkg('foo.bar.baz');
    return it('should define `foo.bar.baz` package', function() {
      return expect(result).toBe(window.foo.bar.baz);
    });
  });
});
;


