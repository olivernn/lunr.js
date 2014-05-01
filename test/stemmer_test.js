module('lunr.stemmer')

test('should stem words correctly', function () {
  Object.keys(stemmingFixture).forEach(function (testWord) {
    var expected = stemmingFixture[testWord]
    equal_with_strings(lunr.stemmer, testWord, expected)
  })
})

test('should not stem tokens with wildcards', function () {
  equal_with_strings(lunr.stemmer, "w*ldcards", "w*ldcards")
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.stemmer.label, 'stemmer')
  deepEqual(lunr.Pipeline.registeredFunctions['stemmer'], lunr.stemmer)
})
