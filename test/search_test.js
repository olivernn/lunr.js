module('search', {
  setup: function () {
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
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title',
      body: 'hand',
    }]

    this.idx = lunr(function () {
      this.ref('id')
      this.field('title')
      this.field('body')

      documents.forEach(function (document) {
        this.add(document)
      }, this)
    })
  }
})

test('returning the correct results', function () {
  var results = this.idx.search('green plant')

  equal(results.length, 3)
  equal(results[0].ref, 'b')
})

test('search term not in the index', function () {
  var results = this.idx.search('foo')

  equal(results.length, 0)
})

test('one search term not in the index', function () {
  var results = this.idx.search('foo green')

  equal(results.length, 3)
})

test('search contains one term not in the index', function () {
  var results = this.idx.search('green foo')

  equal(results.length, 3)
})

test('search based on field', function () {
  var results = this.idx.search("title:professor")
  equal(results.length, 1)
  equal(results[0].ref, 'c')
})

test('search with edit distance', function () {
  var results = this.idx.search("plnt~1")
  equal(results.length, 2)
  equal(results[0].ref, 'b')
  ok(results[0].matchData.terms.indexOf('plant') >= 0)
})

test('search on field with edit distance', function () {
  var results = this.idx.search("title:plank~1")
  equal(results.length, 1)
  equal(results[0].ref, 'b')
  ok(results[0].matchData.terms.indexOf('plant') >= 0)
})

test('search with term boost', function () {
  var results = this.idx.search("candlestick^5 plant")
  equal(results.length, 3)
  deepEqual(results.map(function (r) { return r.ref }), ['a', 'b', 'c'])
})

test('search with wildcards', function () {
  var trailingWildcardResults = this.idx.search("candle*"),
      leadingWildcardResults = this.idx.search("*stick"),
      containedWildcardResults = this.idx.search("can*ick"),
      multiWildcardResults = this.idx.search("*an*sti*")

  equal(trailingWildcardResults.length, 1)
  equal(trailingWildcardResults[0].ref, 'a')
  ok(trailingWildcardResults[0].matchData.terms.indexOf('candlestick') >= 0)

  equal(leadingWildcardResults.length, 1)
  equal(leadingWildcardResults[0].ref, 'a')
  ok(leadingWildcardResults[0].matchData.terms.indexOf('candlestick') >= 0)

  equal(containedWildcardResults.length, 1)
  equal(containedWildcardResults[0].ref, 'a')
  ok(containedWildcardResults[0].matchData.terms.indexOf('candlestick') >= 0)

  equal(multiWildcardResults.length, 1)
  equal(multiWildcardResults[0].ref, 'a')
  ok(multiWildcardResults[0].matchData.terms.indexOf('candlestick') >= 0)
})
