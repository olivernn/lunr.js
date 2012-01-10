module("Word")

test("return nothing for a stop word", function () {
  stopWords.forEach(function (w) {
    var word = new Lunr.Word (w)
    equal(word.toString(), undefined, "stop words should return nothing")
  })
})

test("knows if it is a stop word", function () {
  stopWords.forEach(function (w) {
    var word = new Lunr.Word (w)
    ok(word.isStopWord())
  })
})

test("stemming words", function () {
  unStemmedWords.forEach(function (w, idx) {
    var word = new Lunr.Word(w)
    if (!word.isStopWord()) equal(word.toString(), stemmedWords[idx])
  })
})