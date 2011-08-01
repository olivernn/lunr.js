module("Word")

test("return nothing for a stop word", function () {
  var word = new Lunr.Word ("the")

  equal(word.toString(), undefined, "stop words should return nothing")
})

test("knows if it is a stop word", function () {
  var word = new Lunr.Word ("the")

  ok(word.isStopWord())  
})