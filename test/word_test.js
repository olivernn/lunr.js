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

test("fromString should split a string by word boundries and return an array of lunr words", function () {
  var str = 'foo bar baz',
      out = Lunr.Word.fromString(str)

  equal(out.length, 5, 'should have a word for each word')
})

test("fromString should ignore stop words", function () {
  var str = 'foo and bar',
      out = Lunr.Word.fromString(str)

  equal(out.length, 4, 'should ignore stop words')
})

test("fromString should return instances of Lunr.Word", function () {
  var str = 'foo',
      word = Lunr.Word.fromString(str)[0]

  ok(word instanceof Lunr.Word)
})
