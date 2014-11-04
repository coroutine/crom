describe 'pkg', ->

  describe 'with a graph depth of one', ->
    result = pkg 'foo'

    it 'should define `foo` package', ->
      expect(result).toBe(window.foo)

  describe 'with a graph depth greater than one', ->
    result = pkg 'foo.bar.baz'

    it 'should define `foo.bar.baz` package', ->
      expect(result).toBe(window.foo.bar.baz)
