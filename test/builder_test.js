suite('lunr.Builder', function () {
  suite('#field', function () {
    test('defining fields to index', function () {
      var builder = new lunr.Builder
      builder.field('foo')
      assert.include(builder._fields, 'foo')
    })
  })

  suite('#ref', function () {
    test('default reference', function () {
      var builder = new lunr.Builder
      assert.equal('id', builder._ref)
    })

    test('defining a reference field', function () {
      var builder = new lunr.Builder
      builder.ref('foo')
      assert.equal('foo', builder._ref)
    })
  })

  suite('#build', function () {
    setup(function () {
      var builder = new lunr.Builder,
          doc = { id: 'id', title: 'test', body: 'missing' }

      builder.ref('id')
      builder.field('title')
      builder.add(doc)
      builder.build()

      this.builder = builder
    })

    test('adds tokens to invertedIndex', function () {
      assert.deepProperty(this.builder.invertedIndex, 'test.title.id')
    })

    test('builds a vector space of the document', function () {
      assert.property(this.builder.documentVectors, 'id')
      assert.instanceOf(this.builder.documentVectors.id, lunr.Vector)
    })

    test('skips fields not defined for indexing', function () {
      assert.notProperty(this.builder.invertedIndex, 'missing')
    })

    test('builds a token set for the corpus', function () {
      var needle = lunr.TokenSet.fromString('test')
      assert.include(this.builder.tokenSet.intersect(needle).toArray(), 'test')
    })

    test('calculates document count', function () {
      assert.equal(1, this.builder.documentCount)
    })

    test('calculates average document length', function () {
      assert.equal(1, this.builder.averageDocumentLength)
    })
  })
})
