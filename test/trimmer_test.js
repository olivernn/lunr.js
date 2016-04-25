module('lunr.trimmer')

test('latin characters', function () {
  var token = new lunr.Token ('hello')
  equal(lunr.trimmer(token).toString(), token)
})

test('removing leading and trailing punctuation', function () {
  var fullStop = new lunr.Token ('hello.'),
      innerApostrophe = new lunr.Token ("it's"),
      trailingApostrophe = new lunr.Token ("james'"),
      exclamationMark = new lunr.Token ('stop!'),
      comma = new lunr.Token ('first,'),
      brackets = new lunr.Token ('[tag]')

  deepEqual(lunr.trimmer(fullStop).toString(), 'hello')
  deepEqual(lunr.trimmer(innerApostrophe).toString(), "it's")
  deepEqual(lunr.trimmer(trailingApostrophe).toString(), "james")
  deepEqual(lunr.trimmer(exclamationMark).toString(), 'stop')
  deepEqual(lunr.trimmer(comma).toString(), 'first')
  deepEqual(lunr.trimmer(brackets).toString(), 'tag')
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.trimmer.label, 'trimmer')
  deepEqual(lunr.Pipeline.registeredFunctions['trimmer'], lunr.trimmer)
})
