suite('lunr.stemmer', function () {
  test('reduces words to their stem', function () {
    var testData = JSON.parse(fixture('stemming_vocab.json'))

    Object.keys(testData).forEach(function (word) {
      var expected = testData[word],
          token = new lunr.Token(word),
          result = lunr.stemmer(token).toString()

      assert.equal(expected, result)
    })
  })

  test('is a registered pipeline function', function () {
    assert.equal('stemmer', lunr.stemmer.label)
    assert.equal(lunr.stemmer, lunr.Pipeline.registeredFunctions['stemmer'])
  })
})
