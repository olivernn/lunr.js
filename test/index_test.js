module("Index")

var blankIndex = function () { return new Searchlite.Index ('test') }

test("an index has no fields by default", function () {
  var idx = blankIndex()

  same({}, idx.fields, "should have no fields by default")
})

test("can add simple field to index", function () {
  var idx = blankIndex()

  idx.field('title')

  same({'title': { multiplier: 1 }}, idx.fields)
})

test("can pass options for the field to index", function () {
  var idx = blankIndex()

  idx.field('title', {multiplier: 10})

  same({'title': { multiplier: 10 }}, idx.fields)
})