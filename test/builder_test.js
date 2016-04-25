module('lunr.Builder')

test('defining what fields to index', function () {
  var builder = new lunr.Builder
  builder.field('foo')
  deepEqual(builder._fields, ['foo'])
})

test('default reference should be id', function () {
  var builder = new lunr.Builder
  equal(builder._ref, 'id')
})

test('defining a reference field', function () {
  var builder = new lunr.Builder
  builder.ref('foo')
  equal(builder._ref, 'foo')
})

test('indexing a document', function () {
  var builder = new lunr.Builder,
      doc = { id: 'id', title: 'test' }

  builder.ref('id')
  builder.field('title')

  builder.add(doc)
  builder.build()

  // inverted index contains mapping between word and document/field
  ok('test' in builder.invertedIndex)
  ok('title' in builder.invertedIndex['test'])
  ok('id' in builder.invertedIndex['test']['title'])

  // builds a vector space of the document
  ok('id' in builder.documentVectors)
  ok(builder.documentVectors['id']['title'] instanceof lunr.Vector)
  ok(builder.documentVectors['id']['ALL'] instanceof lunr.Vector)

  // for each dimension in the vector there will be two elements, one for the index, the other for the score
  equal(builder.documentVectors['id']['title'].elements.length, 2)
  equal(builder.documentVectors['id']['ALL'].elements.length, 2)

  // builds the token set for this corpus
  var matches = builder.tokenSet.intersect(lunr.TokenSet.fromString("test")).toArray()
  deepEqual(matches, ["test"])

  // calculates some statisics about the corpus
  equal(builder.documentCount, 1)
  equal(builder.averageFieldLengths['title'], 1)
})

test('skips fields not defined as searchable', function () {
  var builder = new lunr.Builder,
      doc = { id: 'id', title: 'test', body: 'missing' }

  builder.ref('id')
  builder.field('title')

  builder.add(doc)
  builder.build()

  // does not index unspecified fields
  ok(!('missing' in builder.invertedIndex))

  var matches = builder.tokenSet.intersect(lunr.TokenSet.fromString("missing")).toArray()
  deepEqual(matches, [])
})

