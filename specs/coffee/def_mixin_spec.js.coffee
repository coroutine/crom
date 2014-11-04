describe 'def_mixin', ->

  def_mixin 'Foo.Bar.MyMixin',
    party:      () -> 'Yay!'
    goHome:     () -> 'Me so tired... Zzzzz...'
    onInclude:  () -> @onIncludeCalled = true

  describe 'its inclusion within a target', ->
    result = null

    class Target
      onIncludeCalled: false
      constructor: -> Foo.Bar.MyMixin.includeIn(this)

    beforeEach ->
      result = new Target

    it 'should define `party`', ->
      expect(result.party).toBeDefined()

    it 'should define `goHome`', ->
      expect(result.goHome).toBeDefined()

    it 'should call `onInclude` on the mixin', ->
      expect(result.onIncludeCalled).toBeTruthy()

    it 'should have a reference to `__receiver__`', ->
      expect(result.__receiver__).toBeDefined()

    it 'should define a `__locals__` namespace', ->
      expect(result.__locals__).toBeDefined()
