module(lunr.TokenMetadataStore)

test('adding a document to the index', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'}

  idx.field('body')
  idx.add(doc)

  ok(!!idx.tokenMetadataStore.store[doc.id], "tokenMetadataStore has an entry for doc 1")
})

test('searching for a document', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'}

  idx.field('body')
  idx.add(doc)

  var results = idx.search("test")
  equal(results.length, 1, "There should be 1 search result")

  var tokens = results[0].tokens
  equal(tokens.length, 1, "There should be 1 lunr.Token in the result")
})

test('searching for a document with repeated tokens', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'is a test test'}

  idx.field('body')
  idx.add(doc)

  var results = idx.search("test")
      tokens = results[0].tokens

  deepEqual(tokens, [{raw: 'test', startPos: 5, indexedAs: 'test', field:'body'}, {raw: 'test', startPos: 10, indexedAs: 'test', field:'body'}])
})

test('position works with whitespace', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: '   test'}

  idx.field('body')
  idx.add(doc)

  var results = idx.search("test")
      tokens = results[0].tokens

  deepEqual(tokens, [{raw: 'test', startPos: 3, indexedAs: 'test', field:'body'}])
})