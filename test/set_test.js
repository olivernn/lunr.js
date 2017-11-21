suite('lunr.Set', function () {
  suite('#contains', function () {
    suite('complete set', function () {
      test('returns true', function () {
        assert.isOk(lunr.Set.complete.contains('foo'))
      })
    })

    suite('empty set', function () {
      test('returns false', function () {
        assert.isNotOk(lunr.Set.empty.contains('foo'))
      })
    })

    suite('populated set', function () {
      before(function () {
        this.set = new lunr.Set (['foo'])
      })

      test('element contained in set', function () {
        assert.isOk(this.set.contains('foo'))
      })

      test('element not contained in set', function () {
        assert.isNotOk(this.set.contains('bar'))
      })
    })
  })

  suite('#union', function () {
    before(function () {
      this.set = new lunr.Set(['foo'])
    })

    suite('complete set', function () {
      test('contains element', function () {
        var result = lunr.Set.complete.union(this.set)
        assert.isOk(result.contains('foo'))
      })
    })

    suite('empty set', function () {
      test('contains element', function () {
        var result = lunr.Set.empty.union(this.set)
        assert.isOk(result.contains('foo'))
      })
    })

    suite('populated set', function () {
      test('contains both elements', function () {
        var target = new lunr.Set (['bar'])
        var result = target.union(this.set)

        assert.isOk(result.contains('foo'))
        assert.isOk(result.contains('bar'))
        assert.isNotOk(result.contains('baz'))
      })
    })
  })

  suite('#intersect', function () {
    before(function () {
      this.set = new lunr.Set(['foo'])
    })

    suite('complete set', function () {
      test('contains element', function () {
        var result = lunr.Set.complete.intersect(this.set)
        assert.isOk(result.contains('foo'))
      })
    })

    suite('empty set', function () {
      test('does not contain element', function () {
        var result = lunr.Set.empty.intersect(this.set)
        assert.isNotOk(result.contains('foo'))
      })
    })

    suite('populated set', function () {
      suite('no intersection', function () {
        test('contains intersection elements', function () {
          var target = new lunr.Set (['bar'])
          var result = target.intersect(this.set)

          assert.isNotOk(result.contains('foo'))
          assert.isNotOk(result.contains('bar'))
        })
      })

      suite('intersection', function () {
        test('contains intersection elements', function () {
          var target = new lunr.Set (['foo', 'bar'])
          var result = target.intersect(this.set)

          assert.isOk(result.contains('foo'))
          assert.isNotOk(result.contains('bar'))
        })
      })
    })
  })
})
