describe('def_mixin', function() {
  def_mixin('Foo.Bar.MyMixin', {
    party: function() {
      return 'Yay!';
    },
    goHome: function() {
      return 'Me so tired... Zzzzz...';
    },
    onInclude: function() {
      return this.onIncludeCalled = true;
    }
  });
  return describe('its inclusion within a target', function() {
    var Target, result;
    result = null;
    Target = (function() {
      Target.prototype.onIncludeCalled = false;

      function Target() {
        Foo.Bar.MyMixin.includeIn(this);
      }

      return Target;

    })();
    beforeEach(function() {
      return result = new Target;
    });
    it('should define `party`', function() {
      return expect(result.party).toBeDefined();
    });
    it('should define `goHome`', function() {
      return expect(result.goHome).toBeDefined();
    });
    it('should call `onInclude` on the mixin', function() {
      return expect(result.onIncludeCalled).toBeTruthy();
    });
    it('should have a reference to `__receiver__`', function() {
      return expect(result.__receiver__).toBeDefined();
    });
    return it('should define a `__locals__` namespace', function() {
      return expect(result.__locals__).toBeDefined();
    });
  });
});describe('pkg', function() {
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
});describe('URL', function() {
  describe('.dataURL', function() {
    var contentType, dataString, expected;
    contentType = 'image/jpeg';
    dataString = '2660f71d93ffeb5b17905d458da0ad0a';
    expected = "data:" + contentType + ";base64," + dataString;
    describe('with a non dataURL string', function() {
      var result;
      result = URL.dataURL(contentType, dataString);
      return it('should create a new dataURL', function() {
        return expect(result).toEqual(expected);
      });
    });
    return describe('with an existing dataURL', function() {
      var result;
      dataString = expected;
      result = URL.dataURL(contentType, dataString);
      return it('should return the existing dataURL', function() {
        return expect(result).toEqual(dataString);
      });
    });
  });
  return describe('instance methods', function() {
    var inst, urlString;
    urlString = '/controller/action.json';
    inst = null;
    beforeEach(function() {
      return inst = new URL(urlString);
    });
    describe('#toString', function() {
      var result;
      result = null;
      beforeEach(function() {
        return result = inst.toString();
      });
      return it('should return the urlString', function() {
        return expect(result).toEqual(urlString);
      });
    });
    describe('#merge', function() {
      var expected, otherString, otherURL, result;
      otherString = null;
      otherURL = null;
      result = null;
      expected = null;
      beforeEach(function() {
        otherURL = new URL(otherString);
        return result = inst.merge(otherURL).toString();
      });
      describe('with a host part', function() {
        otherString = 'http://foobar.io:3456';
        expected = "" + otherString + urlString;
        return it('should merge the two urls', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('with a query string', function() {
        otherString = '?foo=bar&baz=quux';
        expected = "" + urlString + otherString;
        return it('should merge the two urls', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('with a host and a query string', function() {
        var hostString, queryString;
        hostString = 'https://www.corndogs.com';
        queryString = '?search=mustard';
        otherString = "" + hostString + queryString;
        expected = "" + hostString + urlString + queryString;
        return it('should merge the two urls', function() {
          return expect(result).toEqual(expected);
        });
      });
      return describe('with basic auth credentials', function() {
        otherString = 'https://drdre:beatsbydre@shittyheadphones.com';
        expected = "" + otherString + urlString;
        return it('should merge the two urls', function() {
          return expect(result).toEqual(expected);
        });
      });
    });
    return describe('#set', function() {
      var expected, key, result, value;
      key = null;
      value = null;
      result = null;
      expected = null;
      beforeEach(function() {
        return result = inst.set(key, value).toString();
      });
      describe('set protocol', function() {
        key = 'protocol';
        value = 'https';
        expected = "" + value + "://" + urlString;
        return it('should set the protocol', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('set username', function() {
        key = 'username';
        value = 'petercetera';
        expected = "" + value + ":@" + urlString;
        return it('should set the username', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('set password', function() {
        key = 'password';
        value = 'honorchubby';
        expected = ":" + value + "@" + urlString;
        return it('should set the password', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('set host', function() {
        key = 'host';
        value = 'www.livingcorn.com';
        expected = "" + value + urlString;
        return it('should set the host', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('set port', function() {
        key = 'port';
        value = '2345';
        expected = ":" + value + urlString;
        return it('should set the port', function() {
          return expect(result).toEqual(expected);
        });
      });
      describe('set query', function() {
        key = 'query';
        value = 'pop=1&lock=2';
        expected = "" + urlString + "?" + value;
        return it('should set the query string', function() {
          return expect(result).toEqual(expected);
        });
      });
      return describe('set anchor', function() {
        key = 'anchor';
        value = '#your-new-life';
        expected = "" + urlString + value;
        return it('should set the anchor', function() {
          return expect(result).toEqual(expected);
        });
      });
    });
  });
});
;


