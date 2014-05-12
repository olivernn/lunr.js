module('lunr.tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString).rawTokens()

  deepEqual(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  deepEqual(lunr.tokenizer(simpleString).rawTokens(), ['foo', 'bar'])
  deepEqual(lunr.tokenizer(tags).rawTokens(), ['foo', 'bar'])
})

test('handling arrays', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags).rawTokens()

  deepEqual(tokens, tags)
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = lunr.tokenizer(testString).rawTokens()

  deepEqual(tokens, ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  deepEqual(lunr.tokenizer().rawTokens(), [])
  deepEqual(lunr.tokenizer(null).rawTokens(), [])
  deepEqual(lunr.tokenizer(undefined).rawTokens(), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(lunr.tokenizer(41).rawTokens(), '41')
  equal(lunr.tokenizer(false).rawTokens(), 'false')
  deepEqual(lunr.tokenizer(obj).rawTokens(), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(lunr.tokenizer(date).rawTokens().slice(0, 4), ['tue', 'jan', '01', '2013'])
})

