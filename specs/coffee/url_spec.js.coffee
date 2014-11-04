describe 'URL', ->

  describe '.dataURL', ->
    contentType = 'image/jpeg'
    dataString  = '2660f71d93ffeb5b17905d458da0ad0a'
    expected    = "data:#{contentType};base64,#{dataString}"

    describe 'with a non dataURL string', ->
      result    = URL.dataURL(contentType, dataString)

      it 'should create a new dataURL', ->
        expect(result).toEqual(expected)

    describe 'with an existing dataURL', ->
      dataString  = expected
      result      = URL.dataURL(contentType, dataString)

      it 'should return the existing dataURL', ->
        expect(result).toEqual(dataString)

  describe 'instance methods', ->
    urlString = '/controller/action.json'
    inst      = null

    beforeEach ->
      inst = new URL(urlString)

    # --------------------------------------------------------------------------
    # toString
    # --------------------------------------------------------------------------

    describe '#toString', ->
      result = null

      beforeEach ->
        result = inst.toString()

      it 'should return the urlString', ->
        expect(result).toEqual(urlString)

    # --------------------------------------------------------------------------
    # merge
    # --------------------------------------------------------------------------

    describe '#merge', ->
      otherString = null
      otherURL    = null
      result      = null
      expected    = null

      beforeEach ->
        otherURL  = new URL(otherString)
        result    = inst.merge(otherURL).toString()

      describe 'with a host part', ->
        otherString = 'http://foobar.io:3456'
        expected    = "#{otherString}#{urlString}"

        it 'should merge the two urls', ->
          expect(result).toEqual(expected)

      describe 'with a query string', ->
        otherString = '?foo=bar&baz=quux'
        expected    = "#{urlString}#{otherString}"

        it 'should merge the two urls', ->
          expect(result).toEqual(expected)

      describe 'with a host and a query string', ->
        hostString  = 'https://www.corndogs.com'
        queryString = '?search=mustard'
        otherString = "#{hostString}#{queryString}"
        expected    = "#{hostString}#{urlString}#{queryString}"

        it 'should merge the two urls', ->
          expect(result).toEqual(expected)

      describe 'with basic auth credentials', ->
        otherString = 'https://drdre:beatsbydre@shittyheadphones.com'
        expected    = "#{otherString}#{urlString}"

        it 'should merge the two urls', ->
          expect(result).toEqual(expected)


    # --------------------------------------------------------------------------
    # set
    # --------------------------------------------------------------------------

    describe '#set', ->
      key       = null
      value     = null
      result    = null
      expected  = null

      beforeEach ->
        result = inst.set(key, value).toString()

      describe 'set protocol', ->
        key       = 'protocol'
        value     = 'https'
        expected  = "#{value}://#{urlString}"

        it 'should set the protocol', ->
          expect(result).toEqual(expected)

      describe 'set username', ->
        key       = 'username'
        value     = 'petercetera'
        expected  = "#{value}:@#{urlString}"

        it 'should set the username', ->
          expect(result).toEqual(expected)

      describe 'set password', ->
        key       = 'password'
        value     = 'honorchubby'
        expected  = ":#{value}@#{urlString}"

        it 'should set the password', ->
          expect(result).toEqual(expected)

      describe 'set host', ->
        key       = 'host'
        value     = 'www.livingcorn.com'
        expected  = "#{value}#{urlString}"

        it 'should set the host', ->
          expect(result).toEqual(expected)

      describe 'set port', ->
        key       = 'port'
        value     = '2345'
        expected  = ":#{value}#{urlString}"

        it 'should set the port', ->
          expect(result).toEqual(expected)

      describe 'set query', ->
        key       = 'query'
        value     = 'pop=1&lock=2'
        expected  = "#{urlString}?#{value}"

        it 'should set the query string', ->
          expect(result).toEqual(expected)

      describe 'set anchor', ->
        key       = 'anchor'
        value     = '#your-new-life'
        expected  = "#{urlString}#{value}"

        it 'should set the anchor', ->
          expect(result).toEqual(expected)
