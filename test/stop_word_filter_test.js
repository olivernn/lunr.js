module('lunr.stopWordFilter')

test('stops stop words', function () {
  var stopWords = ['the', 'and', 'but', 'than', 'when']

  stopWords.forEach(function (word) {
    equal(lunr.stopWordFilter(word), undefined)
  })
})

test('non stop words pass through', function () {
  var nonStopWords = ['interesting', 'words', 'pass', 'through']

  nonStopWords.forEach(function (word) {
    equal(lunr.stopWordFilter(word), word)
  })
})

test('should not filter Object.prototype terms', function () {
  var nonStopWords = ['constructor', 'hasOwnProperty', 'toString', 'valueOf']

  nonStopWords.forEach(function (word) {
    equal(lunr.stopWordFilter(word), word)
  })
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.stopWordFilter.label, 'stopWordFilter')
  deepEqual(lunr.Pipeline.registeredFunctions['stopWordFilter'], lunr.stopWordFilter)
})
