module('index')

test("defining what fields to index", function () {
  var idx = new lunr.Index
  idx.field('foo')

  same(idx._fields[0], {name: 'foo', options: undefined})
})

test("defining the reference field for the index", function () {
  var idx = new lunr.Index
  idx.ref('foo')

  same(idx._ref, 'foo')
})

test("searching for a document in the index", function() {
  var idx = new lunr.Index,
      doc1 = {title: 'foo bar baz', id: 1},
      doc2 = {title: 'foo foo foo', id: 2},
      doc3 = {title: 'wont be found', id: 3}

  idx.field('title')

  idx.add(doc1)
  idx.add(doc2)
  idx.add(doc3)

  var results = idx.search('foo')
  same(results, ["2", "1"])
})

test("searching for a document that doesn't exist", function () {
  var idx = new lunr.Index,
      doc1 = {title: 'foo bar baz', id: 1}

  idx.field('title')
  idx.add(doc1)

  same(idx.search('test'), [])
})
