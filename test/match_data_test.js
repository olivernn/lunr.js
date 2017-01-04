suite('lunr.MatchData', function () {
  suite('#combine', function () {
    setup(function () {
      this.match = new lunr.MatchData('foo', 'title', {
        position: [1]
      })

      this.match.combine(new lunr.MatchData('bar', 'title', {
        position: [2]
      }))

      this.match.combine(new lunr.MatchData('baz', 'body', {
        position: [3]
      }))
    })

    test('terms', function () {
      assert.sameMembers(['foo', 'bar', 'baz'], this.match.terms)
    })

    test('metadata', function () {
      assert.deepEqual(this.match.metadata.title.position, [1,2])
      assert.deepEqual(this.match.metadata.body.position, [3])
    })
  })
})
