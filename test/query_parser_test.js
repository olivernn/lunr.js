module("lunr.QueryParser")

test("single term", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "fields": ["title", "body"]
  }])
})

test("single term with wildcard", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("fo*", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "fo*",
    "hasWildcard": true,
    "fields": ["title", "body"]
  }])
})

test("multiple terms", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo bar", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "fields": ["title", "body"]
  },{
    "term": "bar",
    "fields": ["title", "body"]
  }])
})

test("field without a term", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:", query)

  throws(function () { parser.parse() }, lunr.QueryParseError)
})

test("single term scoped to field", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:foo", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "fields": ["title"],
    "term": "foo"
  }])
})

test("single term scoped to an unknown field", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("blah:foo", query)

  throws(function () { parser.parse() }, lunr.QueryParseError)
})

test("multiple terms scoped to fields", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:foo body:bar body:baz", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "fields": ["title"],
    "term": "foo"
  },{
    "fields": ["body"],
    "term": "bar"
  },{
    "fields": ["body"],
    "term": "baz"
  }])
})

test("multiple terms scoped and unscoped", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:foo body:bar baz", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "fields": ["title"],
    "term": "foo"
  },{
    "fields": ["body"],
    "term": "bar"
  },{
    "term": "baz",
    "fields": ["title", "body"]
  }])
})

test("single term with edit distance", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo~2", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "editDistance": 2,
    "fields": ["title", "body"]
  }])
})

test("single term with non numeric edit distance", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo~a", query)

  throws(function () { parser.parse() }, lunr.QueryParseError)
})

test("edit distance without a term", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("~1", query)

  throws(function () { parser.parse() }, lunr.QueryParseError)
})

test("single term, scoped to field, with edit distance", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:foo~2", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "fields": ["title"],
    "term": "foo",
    "editDistance": 2
  }])
})

test("multiple terms with edit distance", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo~2 bar~3", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "editDistance": 2,
    "fields": ["title", "body"]
  },{
    "term": "bar",
    "editDistance": 3,
    "fields": ["title", "body"]
  }])
})

test("single term with boost", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo^2", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "boost": 2,
    "fields": ["title", "body"]
  }])
})

test("single term with non numeric boost", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo^a", query)

  throws(function () { parser.parse() }, lunr.QueryParseError)
})

test("single term, scoped to field, with boost", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("title:foo^2", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "fields": ["title"],
    "term": "foo",
    "boost": 2
  }])
})

test("multiple terms with boost", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo^2 bar^3", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "boost": 2,
    "fields": ["title", "body"]
  },{
    "term": "bar",
    "boost": 3,
    "fields": ["title", "body"]
  }])
})

test("term with boost and editDistance", function () {
  var query = new lunr.Query (["title", "body"]),
      parser = new lunr.QueryParser("foo~2^3", query)

  parser.parse()

  deepEqual(query.clauses, [{
    "term": "foo",
    "boost": 3,
    "editDistance": 2,
    "fields": ["title", "body"]
  }])
})
