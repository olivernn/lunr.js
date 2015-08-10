module('search', {
  setup: function () {
    var idx = new lunr.Index
    idx.field('body')
    idx.field('title', { boost: 10 })

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
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title',
      body: 'hand',
    },{
      id: 10,
      title: 'ten',
      body: 'ten 10'
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

test('one search term not in the index', function () {
  var results = this.idx.search('foo green')

  equal(results.length, 0)
})

test('search contains one term not in the index', function () {
  var results = this.idx.search('green foo')

  equal(results.length, 0)
})

test('search takes into account boosts', function () {
  var results = this.idx.search('professor')

  equal(results.length, 2)
  equal(results[0].ref, 'c')

  ok(results[0].score > 10 * results[1].score)
})

test('search boosts exact matches', function () {
  var results = this.idx.search('hand')

  equal(results.length, 2)
  equal(results[0].ref, 'e')

  ok(results[0].score > results[1].score)
})

test('returning the correct type for reference', function () {
  var results = this.idx.search('ten');
  equal(results.length, 1)
  equal(typeof results[0].ref, 'number')
  equal(results[0].ref, 10)
})
