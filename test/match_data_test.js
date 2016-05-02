module('lunr.MatchData')

test('combining', function () {
  var matchA = new lunr.MatchData("foo", "title", {
    position: [1]
  })

  var matchB = new lunr.MatchData("bar", "title", {
    position: [2]
  })

  matchA.combine(matchB)

  deepEqual(matchA.terms, ["foo", "bar"])
  deepEqual(matchA.metadata.title, { position: [1,2] })
})
