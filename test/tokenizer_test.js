module('lunr.tokenizer')

var equalTokens = function (a, b) {
  deepEqual(a.map(function (t) { return t.toString() }), b)
}

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  equalTokens(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  equalTokens(lunr.tokenizer(simpleString), ['foo', 'bar'])
  equalTokens(lunr.tokenizer(tags), ['foo', 'bar'])
})

test('handling arrays', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags)

  equalTokens(tokens, tags)
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = lunr.tokenizer(testString)

  equalTokens(tokens, ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  equalTokens(lunr.tokenizer(), [])
  equalTokens(lunr.tokenizer(null), [])
  equalTokens(lunr.tokenizer(undefined), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(lunr.tokenizer(41), '41')
  equal(lunr.tokenizer(false), 'false')
  equalTokens(lunr.tokenizer(obj), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  equalTokens(lunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013'])
})

