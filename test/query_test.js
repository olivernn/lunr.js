suite('lunr.Query', function () {
  var allFields = ['title', 'body']

  suite('#clause', function () {
    setup(function () {
      this.query = new lunr.Query (allFields)
    })

    suite('defaults', function () {
      setup(function () {
        this.query.clause({term: 'foo'})
        this.clause = this.query.clauses[0]
      })

      test('fields', function () {
        assert.sameMembers(this.clause.fields, allFields)
      })

      test('boost', function () {
        assert.equal(this.clause.boost, 1)
      })

      test('usePipeline', function () {
        assert.isTrue(this.clause.usePipeline)
      })
    })

    suite('specified', function () {
      setup(function () {
        this.query.clause({
          term: 'foo',
          boost: 10,
          fields: ['title'],
          usePipeline: false
        })

        this.clause = this.query.clauses[0]
      })

      test('fields', function () {
        assert.sameMembers(this.clause.fields, ['title'])
      })

      test('boost', function () {
        assert.equal(this.clause.boost, 10)
      })

      test('usePipeline', function () {
        assert.isFalse(this.clause.usePipeline)
      })
    })
  })
})
