module("Word")

test("preparing a word for the index", function () {
  var word = new Search.Word ("exciting")

  equal(word.toString(), "EKSS", "should stem and metaphone the word")
})

test("return nothing for a stop word", function () {
  var word = new Search.Word ("the")

  equal(word.toString(), undefined, "stop words should return nothing")
})

test("knows if it is a stop word", function () {
  var word = new Search.Word ("the")

  ok(word.isStopWord())  
})