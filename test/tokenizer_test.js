module('lunr.tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  deepEqual(lunr.tokenizer(simpleString), ['foo', 'bar'])
  deepEqual(lunr.tokenizer(tags), ['foo', 'bar'])
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
      comma = 'first, second and third',
      brackets = '[tag] non-tag'

  deepEqual(lunr.tokenizer(fullStop), ['hello'])
  deepEqual(lunr.tokenizer(innerApostrophe), ["it's"])
  deepEqual(lunr.tokenizer(trailingApostrophe), ["james", 'ball'])
  deepEqual(lunr.tokenizer(exclamationMark), ['stop'])
  deepEqual(lunr.tokenizer(comma), ['first', 'second', 'and', 'third'])
  deepEqual(lunr.tokenizer(brackets), ['tag', 'non-tag'])
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = lunr.tokenizer(testString)

  deepEqual(tokens, ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  deepEqual(lunr.tokenizer(), [])
  deepEqual(lunr.tokenizer(null), [])
  deepEqual(lunr.tokenizer(undefined), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(lunr.tokenizer(41), '41')
  equal(lunr.tokenizer(false), 'false')
  deepEqual(lunr.tokenizer(obj), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(lunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013'])
})

