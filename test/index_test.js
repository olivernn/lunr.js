module('index')

test("defining what fields to index", function () {
  var idx = new lunr.Index
  idx.field('foo')

  same(idx._fields[0], {name: 'foo', boost: 1})
})

test("giving a particular field a weighting", function () {
  var idx = new lunr.Index
  idx.field('foo', 10)

  same(idx._fields[0], {name: 'foo', boost: 10})
})

test('default reference should be id', function () {
  var idx = new lunr.Index
  equal(idx._ref, 'id')
})

test("defining the reference field for the index", function () {
  var idx = new lunr.Index
  idx.ref('foo')

  same(idx._ref, 'foo')
})

test('adding a document to the index', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'}

  idx.field('body')
  idx.add(doc)

  equal(idx.documentStore.length, 1)
  ok(!!idx.documentStore.get(1))
})

