module('search', {
  setup: function () {
    var idx = new lunr.Index
    idx.field('body')
    idx.field('title', { boost: 10 })
    var ngramidx = new lunr.Index
    ngramidx.field('body')
    ngramidx.field('title', { boost: 10 })
    ngramidx.pipeline.clear()
    ngramidx.requireAllTerms = false
    ngramidx.tokenizer = lunr.trigramtokenizer

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
    }]).forEach(function (doc) { idx.add(doc), ngramidx.add(doc) })

    this.idx = idx
    this.ngramidx = ngramidx
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

test('ngram search prefix matching', function () {
  var results = this.ngramidx.search('plu')

  equal(results.length, 2)
  equal(results[0].ref, 'b')
  equal(results[1].ref, 'c')
})

test('ngram search suffix matching', function () {
  var results = this.ngramidx.search('udy')

  equal(results.length, 2)
  equal(results[0].ref, 'b')
  equal(results[1].ref, 'a')
})

test('ngram search query too short', function () {
  var results = this.ngramidx.search('y')

  equal(results.length, 0)
})

test('ngram search mid string phrase with typo', function () {
  var results = this.ngramidx.search('aweigh from his off')

  equal(results[0].ref, 'c')
})
