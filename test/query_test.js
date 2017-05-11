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

    suite('wildcards', function () {
      suite('none', function () {
        setup(function () {
          this.query.clause({
            term: 'foo',
            wildcard: lunr.Query.wildcard.NONE
          })

          this.clause = this.query.clauses[0]
        })

        test('no wildcard', function () {
          assert.equal(this.clause.term, 'foo')
        })
      })

      suite('leading', function () {
        setup(function () {
          this.query.clause({
            term: 'foo',
            wildcard: lunr.Query.wildcard.LEADING
          })

          this.clause = this.query.clauses[0]
        })

        test('adds wildcard', function () {
          assert.equal(this.clause.term, '*foo')
        })
      })

      suite('trailing', function () {
        setup(function () {
          this.query.clause({
            term: 'foo',
            wildcard: lunr.Query.wildcard.TRAILING
          })

          this.clause = this.query.clauses[0]
        })

        test('adds wildcard', function () {
          assert.equal(this.clause.term, 'foo*')
        })
      })

      suite('leading and trailing', function () {
        setup(function () {
          this.query.clause({
            term: 'foo',
            wildcard: lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING
          })

          this.clause = this.query.clauses[0]
        })

        test('adds wildcards', function () {
          assert.equal(this.clause.term, '*foo*')
        })
      })

      suite('existing', function () {
        setup(function () {
          this.query.clause({
            term: '*foo*',
            wildcard: lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING
          })

          this.clause = this.query.clauses[0]
        })

        test('no additional wildcards', function () {
          assert.equal(this.clause.term, '*foo*')
        })
      })
    })
  })
})
