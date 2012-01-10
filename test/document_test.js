module("Document")

var testRawDoc = {
  id: 1,
  title: "Foo",
  body: "Foo"
}

var fields = {
  title: {multiplier: 1},
  body: {multiplier: 1}
}

test("getting scored & stemmed words from a document", function () {
  var doc = new Lunr.Document(testRawDoc, 'id', fields)
  equal(doc.words()[0].id, "foo", "foo gets turned into foo")
  equal(doc.words()[0].doc.score, 2, "foo is in the document twice")
})

test("multiplier is applied correctly", function () {
  var doc = new Lunr.Document({"title": "foo"}, 'id', {"title": {"multiplier": 10}})
  equal(doc.words()[0].doc.score, 10, "foo appears in the document once but the title has a weight of 10")
})

test("multiple words in different fields", function () {
  var doc = new Lunr.Document({'title': 'foo bar baz', 'description': 'foo', 'id': 1}, 'id', {'title': {'multiplier': 10}, 'description': {'multiplier': 1}})
  var firstWord = doc.words()[0]
  equal(firstWord.id, 'foo', 'should set the word as the id')
  equal(firstWord.doc.score, 11, 'should add up all occurances of this word')
})
