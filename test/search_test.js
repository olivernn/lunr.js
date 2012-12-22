module('search', {
  setup: function () {
    var idx = new lunr.Index
    idx.field('body')
    idx.field('title', 10)

    ;([{
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
    }]).forEach(function (doc) { idx.add(doc) })

    this.idx = idx
  }
})

test('returning the correct results', function () {
  var results = this.idx.search('green plant')

  equal(results.length, 2)
  equal(results[0].ref, 'b')
})

test('search term not in the index', function () {
  var results = this.idx.search('foo')

  equal(results.length, 0)
})

test('search contains one term not in the index', function () {
  var resultSetA = this.idx.search('green foo'),
      resultSetB = this.idx.search('green')

  deepEqual(resultSetA, resultSetB, 'search terms not in the index should just be ignored')
})

test('search takes into account boosts', function () {
  var results = this.idx.search('professor')

  equal(results.length, 2)
  equal(results[0].ref, 'c')

  ok(results[0].score > 10 * results[1].score)
})
