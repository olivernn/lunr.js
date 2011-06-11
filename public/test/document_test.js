module("Document")

var testRawDoc = {
  title: "Foo",
  body: "Foo"
}

var fields = {
  title: {multiplier: 1},
  body: {multiplier: 1}
}

test("getting scored & stemmed words from a document", function () {
  var doc = new Search.Document(testRawDoc, fields)
  equal(doc.words().F.score, 2, "foo appears in the document twice")
})

test("multiplier is applied correctly", function () {
  var doc = new Search.Document({"title": "foo"}, {"title": {"multiplier": 10}})
  equal(doc.words().F.score, 10, "foo appears in the document once but the title has a weight of 10")
})