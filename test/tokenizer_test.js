module('tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  same(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('handling arrays', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags)

  deepEqual(tokens, tags)
})

test('removing punctuation', function () {
  var fullStop = 'hello.',
      innerApostrophe = "it's",
      trailingApostrophe = "james' ball",
      exclamationMark = 'stop!',
      comma = 'first, second and third'

  deepEqual(lunr.tokenizer(fullStop), ['hello'])
  deepEqual(lunr.tokenizer(innerApostrophe), ["it's"])
  deepEqual(lunr.tokenizer(trailingApostrophe), ["james'", 'ball'])
  deepEqual(lunr.tokenizer(exclamationMark), ['stop'])
  deepEqual(lunr.tokenizer(comma), ['first', 'second', 'and', 'third'])
})

test('handling multiple white spaces', function () {
  var testString = 'foo    bar',
      tokens = lunr.tokenizer(testString)

  deepEqual(tokens, ['foo', 'bar'])
})
