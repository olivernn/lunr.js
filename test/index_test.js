module("Index")

var blankIndex = function () { return new Lunr.Index ('test') }

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

test("performing some searches", function () {
  idx = Lunr("barbar", function () {
    this.ref('id')

    this.field('title', {
      'multiplier': 10
    })

    this.field('tags', {
      'multiplier': 100
    })

    this.field('body')
  })

  testDocs.forEach(function (doc) {
    idx.add(doc)
  })

  same(idx.search('ruby'), [6413951, 6411778])
  same(idx.search('ruby nested'), [6411778])
  same(idx.search('nested'), [6411778, 6413720, 6411194])
  same(idx.search('fix'), idx.search('fixing'))
  same(idx.search('nonexistentterm'), [])
})