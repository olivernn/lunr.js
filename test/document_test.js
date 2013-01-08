module("lunr.Document")

test("creating a document", function () {
  var doc = new lunr.Document ({id: 1, title: ['foo', 'bar', 'baz']})

  equal(doc.id, 1)
})

test("converting the document to a posting returns a posting for each term", function () {
  var doc = new lunr.Document ({id: 1, title: ['foo']}),
      postings = doc.toPostings()

  ok('foo' in postings)
})

test("each posting should include the document id", function () {
  var doc = new lunr.Document ({id: 1, title: ['foo']}),
      postings = doc.toPostings(),
      posting = postings['foo']

  equal(posting.id, 1)
})

test("each posting should include a field property for field", function () {
  var doc = new lunr.Document ({id: 1, title: ['foo']}),
      postings = doc.toPostings(),
      posting = postings.foo

  ok('title' in posting.fields)
  ok(!('id' in posting.fields))
})

test("should calculate the term frequency for each term per field", function () {
  var doc = new lunr.Document ({id: 1, title: ['hello', 'world']}),
      postings = doc.toPostings(),
      posting = postings.hello

  equal(posting.fields.title, 0.5)
})

test("should calculate the term frequency for each term per field for all fields", function () {
  var doc = new lunr.Document ({id: 1, title: ['hello', 'world'], body: ['hello', 'world', 'foo', 'bar']}),
      postings = doc.toPostings(),
      posting = postings.hello

  equal(posting.fields.title, 0.5)
  equal(posting.fields.body, 0.25)
})
