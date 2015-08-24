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

test('ref type is not changed to a string', function () {
  var idx = new lunr.Index
  idx.field('type')

  var objKey = {},
      arrKey = [],
      dateKey = new Date,
      numKey = 1,
      strKey = "foo"

  idx.add({id: objKey, type: "object"})
  idx.add({id: arrKey, type: "array"})
  idx.add({id: dateKey, type: "date"})
  idx.add({id: numKey, type: "number"})
  idx.add({id: strKey, type: "string"})

  deepEqual(idx.search("object")[0].ref, objKey)
  deepEqual(idx.search("array")[0].ref, arrKey)
  deepEqual(idx.search("date")[0].ref, dateKey)
  deepEqual(idx.search("number")[0].ref, numKey)
  deepEqual(idx.search("string")[0].ref, strKey)
})
