suite('search', function () {
  setup(function () {
    var documents = [{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters plant',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    }]

    this.idx = lunr(function () {
      this.ref('id')
      this.field('title')
      this.field('body')

      documents.forEach(function (document) {
        this.add(document)
      }, this)
    })
  })

  suite('single term search', function () {
    suite('one match', function () {
      setup(function () {
        this.results = this.idx.search('scarlett')
      })

      test('one result returned', function () {
        assert.lengthOf(this.results, 1)
      })

      test('document c matches', function () {
        assert.equal('c', this.results[0].ref)
      })

      test('matching term', function () {
        assert.sameMembers(['scarlett'], Object.keys(this.results[0].matchData.metadata))
      })
    })

    suite('no match', function () {
      setup(function () {
        this.results = this.idx.search('foo')
      })

      test('no matches', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('multiple matches', function () {
      setup(function () {
        this.results = this.idx.search('plant')
      })

      test('has two matches', function () {
        assert.lengthOf(this.results, 2)
      })

      test('sorted by relevance', function () {
        assert.equal('b', this.results[0].ref)
        assert.equal('c', this.results[1].ref)
      })
    })

    suite('pipeline processing', function () {
      // study would be stemmed to studi, tokens
      // are stemmed by default on index and must
      // also be stemmed on search to match
      suite('enabled (default)', function () {
        setup(function () {
          this.results = this.idx.query(function (q) {
            q.clause({term: 'study', usePipeline: true})
          })
        })

        test('has two matches', function () {
          assert.lengthOf(this.results, 2)
        })

        test('sorted by relevance', function () {
          assert.equal('b', this.results[0].ref)
          assert.equal('a', this.results[1].ref)
        })
      })

      suite('disabled', function () {
        setup(function () {
          this.results = this.idx.query(function (q) {
            q.clause({term: 'study', usePipeline: false})
          })
        })

        test('no matches', function () {
          assert.lengthOf(this.results, 0)
        })
      })
    })
  })

  suite('multiple terms', function () {
    suite('all terms match', function () {
      setup(function () {
        this.results = this.idx.search('fellow candlestick')
      })

      test('has one match', function () {
        assert.lengthOf(this.results, 1)
      })

      test('correct document returned', function () {
        assert.equal('a', this.results[0].ref)
      })

      test('matched terms returned', function () {
        assert.sameMembers(['fellow', 'candlestick'], Object.keys(this.results[0].matchData.metadata))
        assert.sameMembers(['body'], Object.keys(this.results[0].matchData.metadata['fellow']));
        assert.sameMembers(['body'], Object.keys(this.results[0].matchData.metadata['candlestick']));
      })
    })

    suite('one term matches', function () {
      setup(function () {
        this.results = this.idx.search('week foo')
      })

      test('has one match', function () {
        assert.lengthOf(this.results, 1)
      })

      test('correct document returned', function () {
        assert.equal('c', this.results[0].ref)
      })

      test('only matching terms returned', function () {
        assert.sameMembers(['week'], Object.keys(this.results[0].matchData.metadata))
      })
    })

    suite('duplicate query terms', function () {
      // https://github.com/olivernn/lunr.js/issues/256
      // previously this would throw a duplicate index error
      // because the query vector already contained an entry
      // for the term 'fellow'
      test('no errors', function () {
        var idx = this.idx
        assert.doesNotThrow(function () {
          idx.search('fellow candlestick foo bar green plant fellow')
        })
      })
    })

    suite('documents with all terms score higher', function () {
      setup(function () {
        this.results = this.idx.search('candlestick green')
      })

      test('has three matches', function () {
        assert.lengthOf(this.results, 3)
      })

      test('correct documents returned', function () {
        var matchingDocuments = this.results.map(function (r) {
          return r.ref
        })
        assert.sameMembers(['a', 'b', 'c'], matchingDocuments)
      })

      test('documents with all terms score highest', function () {
        assert.equal('a', this.results[0].ref)
      })

      test('matching terms are returned', function () {
        assert.sameMembers(['candlestick', 'green'], Object.keys(this.results[0].matchData.metadata))
        assert.sameMembers(['green'], Object.keys(this.results[1].matchData.metadata))
        assert.sameMembers(['green'], Object.keys(this.results[2].matchData.metadata))
      })
    })

    suite('no terms match', function () {
      setup(function () {
        this.results = this.idx.search('foo bar')
      })

      test('no matches', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('corpus terms are stemmed', function () {
      setup(function () {
        this.results = this.idx.search('water')
      })

      test('matches two documents', function () {
        assert.lengthOf(this.results, 2)
      })

      test('matches correct documents', function () {
        var matchingDocuments = this.results.map(function (r) {
          return r.ref
        })
        assert.sameMembers(['b', 'c'], matchingDocuments)
      })
    })

    suite('field scoped terms', function () {
      suite('only matches on scoped field', function () {
        setup(function () {
          this.results = this.idx.search('title:plant')
        })

        test('one result returned', function () {
          assert.lengthOf(this.results, 1)
        })

        test('returns the correct document', function () {
          assert.equal('b', this.results[0].ref)
        })

        test('match data', function () {
          assert.sameMembers(['plant'], Object.keys(this.results[0].matchData.metadata))
        })
      })

      suite('no matching terms', function () {
        setup(function () {
          this.results = this.idx.search('title:candlestick')
        })

        test('no results returned', function () {
          assert.lengthOf(this.results, 0)
        })
      })
    })

    suite('wildcard matching', function () {
      suite('trailing wildcard', function () {
        suite('no matches', function () {
          setup(function () {
            this.results = this.idx.search('fo*')
          })

          test('no results returned', function () {
            assert.lengthOf(this.results, 0)
          })
        })

        suite('one match', function () {
          setup(function () {
            this.results = this.idx.search('candle*')
          })

          test('one result returned', function () {
            assert.lengthOf(this.results, 1)
          })

          test('correct document matched', function () {
            assert.equal('a', this.results[0].ref)
          })

          test('matching terms returned', function () {
            assert.sameMembers(['candlestick'], Object.keys(this.results[0].matchData.metadata))
          })
        })

        suite('multiple terms match', function () {
          setup(function () {
            this.results = this.idx.search('pl*')
          })

          test('two results returned', function () {
            assert.lengthOf(this.results, 2)
          })

          test('correct documents matched', function () {
            var matchingDocuments = this.results.map(function (r) {
              return r.ref
            })
            assert.sameMembers(['b', 'c'], matchingDocuments)
          })

          test('matching terms returned', function () {
            assert.sameMembers(['plumb', 'plant'], Object.keys(this.results[0].matchData.metadata))
            assert.sameMembers(['plumb', 'plant'], Object.keys(this.results[1].matchData.metadata))
          })
        })
      })
    })
  })

  suite('wildcard matching', function () {
    suite('trailing wildcard', function () {
      suite('no matches found', function () {
        setup(function () {
          this.results = this.idx.search('fo*')
        })

        test('no results returned', function () {
          assert.lengthOf(this.results, 0)
        })
      })

      suite('results found', function () {
        setup(function () {
          this.results = this.idx.search('pl*')
        })

        test('two results returned', function () {
          assert.lengthOf(this.results, 2)
        })

        test('matching documents returned', function () {
          assert.equal('b', this.results[0].ref)
          assert.equal('c', this.results[1].ref)
        })

        test('matching terms returned', function () {
          assert.sameMembers(['plant', 'plumb'], Object.keys(this.results[0].matchData.metadata))
          assert.sameMembers(['plant', 'plumb'], Object.keys(this.results[1].matchData.metadata))
        })
      })
    })

    suite('leading wildcard', function () {
      suite('no results found', function () {
        setup(function () {
          this.results = this.idx.search('*oo')
        })

        test('no results found', function () {
          assert.lengthOf(this.results, 0)
        })
      })

      suite('results found', function () {
        setup(function () {
          this.results = this.idx.search('*ant')
        })

        test('two results found', function () {
          assert.lengthOf(this.results, 2)
        })

        test('matching documents returned', function () {
          assert.equal('b', this.results[0].ref)
          assert.equal('c', this.results[1].ref)
        })

        test('matching terms returned', function () {
          assert.sameMembers(['plant'], Object.keys(this.results[0].matchData.metadata))
          assert.sameMembers(['plant'], Object.keys(this.results[1].matchData.metadata))
        })
      })
    })

    suite('contained wildcard', function () {
      suite('no results found', function () {
        setup(function () {
          this.results = this.idx.search('f*o')
        })

        test('no results found', function () {
          assert.lengthOf(this.results, 0)
        })
      })

      suite('results found', function () {
        setup(function () {
          this.results = this.idx.search('pl*nt')
        })

        test('two results found', function () {
          assert.lengthOf(this.results, 2)
        })

        test('matching documents returned', function () {
          assert.equal('b', this.results[0].ref)
          assert.equal('c', this.results[1].ref)
        })

        test('matching terms returned', function () {
          assert.sameMembers(['plant'], Object.keys(this.results[0].matchData.metadata))
          assert.sameMembers(['plant'], Object.keys(this.results[1].matchData.metadata))
        })
      })
    })
  })

  suite('edit distance', function () {
    suite('no results found', function () {
      setup(function () {
        this.results = this.idx.search('foo~1')
      })

      test('no results returned', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('results found', function () {
      setup(function () {
        this.results = this.idx.search('plont~1')
      })

      test('two results found', function () {
        assert.lengthOf(this.results, 2)
      })

      test('matching documents returned', function () {
        assert.equal('b', this.results[0].ref)
        assert.equal('c', this.results[1].ref)
      })

      test('matching terms returned', function () {
        assert.sameMembers(['plant'], Object.keys(this.results[0].matchData.metadata))
        assert.sameMembers(['plant'], Object.keys(this.results[1].matchData.metadata))
      })
    })
  })

  suite('searching by field', function () {
    suite('unknown field', function () {
      test('throws lunr.QueryParseError', function () {
        assert.throws(function () {
          this.idx.search('unknown-field:plant')
        }.bind(this), lunr.QueryParseError)
      })
    })

    suite('no results found', function () {
      setup(function () {
        this.results = this.idx.search('title:candlestick')
      })

      test('no results found', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('results found', function () {
      setup(function () {
        this.results = this.idx.search('title:plant')
      })

      test('one results found', function () {
        assert.lengthOf(this.results, 1)
      })

      test('matching documents returned', function () {
        assert.equal('b', this.results[0].ref)
      })

      test('matching terms returned', function () {
        assert.sameMembers(['plant'], Object.keys(this.results[0].matchData.metadata))
      })
    })
  })

  suite('term boosts', function () {
    suite('no results found', function () {
      setup(function () {
        this.results = this.idx.search('foo^10')
      })

      test('no results found', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('results found', function () {
      setup(function () {
        this.results = this.idx.search('scarlett candlestick^5')
      })

      test('two results found', function () {
        assert.lengthOf(this.results, 2)
      })

      test('matching documents returned', function () {
        assert.equal('a', this.results[0].ref)
        assert.equal('c', this.results[1].ref)
      })

      test('matching terms returned', function () {
        assert.sameMembers(['candlestick'], Object.keys(this.results[0].matchData.metadata))
        assert.sameMembers(['scarlett'], Object.keys(this.results[1].matchData.metadata))
      })
    })
  })

  suite('typeahead style search', function () {
    suite('no results found', function () {
      setup(function () {
        this.results = this.idx.query(function (q) {
          q.term("xyz", { boost: 100, usePipeline: true })
          q.term("xyz", { boost: 10, usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING })
          q.term("xyz", { boost: 1, editDistance: 1 })
        })
      })

      test('no results found', function () {
        assert.lengthOf(this.results, 0)
      })
    })

    suite('results found', function () {
      setup(function () {
        this.results = this.idx.query(function (q) {
          q.term("pl", { boost: 100, usePipeline: true })
          q.term("pl", { boost: 10, usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING })
          q.term("pl", { boost: 1, editDistance: 1 })
        })
      })

      test('two results found', function () {
        assert.lengthOf(this.results, 2)
      })

      test('matching documents returned', function () {
        assert.equal('b', this.results[0].ref)
        assert.equal('c', this.results[1].ref)
      })

      test('matching terms returned', function () {
        assert.sameMembers(['plumb', 'plant'], Object.keys(this.results[0].matchData.metadata))
        assert.sameMembers(['plumb', 'plant'], Object.keys(this.results[1].matchData.metadata))
      })
    })
  })
})
