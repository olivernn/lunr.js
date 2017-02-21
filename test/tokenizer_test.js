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

test('handling arrays of strings', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags)

  deepEqual(tokens, tags)
})

test('handling arrays with undefined or null values', function () {
  var arr = ['foo', undefined, null, 'bar'],
      tokens = lunr.tokenizer(arr)

  deepEqual(tokens, ['foo', '', '', 'bar'])
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
  var date = new Date (Date.UTC(2013, 0, 1, 12)),
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

test("splitting strings with hyphens", function () {
  var simpleString = "take the New York-San Francisco flight",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight'])
})

test("splitting strings with hyphens and spaces", function () {
  var simpleString = "Solve for A - B",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['solve', 'for', 'a', 'b'])
})

test("registering a tokenizer function", function () {
  var fn = function () {}
  lunr.tokenizer.registerFunction(fn, 'test')

  equal(fn.label, 'test')
  equal(lunr.tokenizer.registeredFunctions['test'], fn)

  delete lunr.tokenizer.registerFunction['test'] // resetting the state after the test
})

test("loading a registered tokenizer", function () {
  var serialized = 'default', // default tokenizer is already registered
      tokenizerFn = lunr.tokenizer.load(serialized)

  equal(tokenizerFn, lunr.tokenizer)
})

test("loading an un-registered tokenizer", function () {
  var serialized = 'un-registered' // default tokenizer is already registered

  throws(function () {
    lunr.tokenizer.load(serialized)
  })
})

test('custom separator', function () {
  try {
    var defaultSeparator = lunr.tokenizer.separator,
        str = 'foo|bar|baz'

    lunr.tokenizer.separator = '|'

    deepEqual(lunr.tokenizer(str), ['foo', 'bar', 'baz'])
  } finally {
    lunr.tokenizer.separator = defaultSeparator
  }
})

