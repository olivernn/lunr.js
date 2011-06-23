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
  var doc = new Searchlite.Document(testRawDoc, fields)
  equal(doc.words()[0].id, "foo", "foo gets turned into foo")
  equal(doc.words()[0].docs[0].score, 2, "foo is in the document twice")
})

test("multiplier is applied correctly", function () {
  doc = new Searchlite.Document({"title": "foo"}, {"title": {"multiplier": 10}})
  equal(doc.words()[0].docs[0].score, 10, "foo appears in the document once but the title has a weight of 10")
})