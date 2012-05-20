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

test("adding a document to the index", function () {
      idx = new lunr.Index,
      testObj = {title: 'this is a test', id: 1}

  idx.field('title')
  idx.add(testObj)
})