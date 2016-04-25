module('lunr.tokenizer')

var toString = function (o) { return o.toString() }

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens.map(toString), ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  deepEqual(lunr.tokenizer(simpleString).map(toString), ['foo', 'bar'])
  deepEqual(lunr.tokenizer(tags).map(toString), ['foo', 'bar'])
})

test('handling arrays of strings', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags)

  deepEqual(tokens.map(toString), tags)
})

test('handling arrays with undefined or null values', function () {
  var arr = ['foo', undefined, null, 'bar'],
      tokens = lunr.tokenizer(arr)

  deepEqual(tokens.map(toString), ['foo', '', '', 'bar'])
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = lunr.tokenizer(testString)

  deepEqual(tokens.map(toString), ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  deepEqual(lunr.tokenizer().map(toString), [])
  deepEqual(lunr.tokenizer(null).map(toString), [])
  deepEqual(lunr.tokenizer(undefined).map(toString), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1, 12)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(lunr.tokenizer(41).map(toString), '41')
  equal(lunr.tokenizer(false).map(toString), 'false')
  deepEqual(lunr.tokenizer(obj).map(toString), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(lunr.tokenizer(date).slice(0, 4).map(toString), ['tue', 'jan', '01', '2013'])
})

test("splitting strings with hyphens", function () {
  var simpleString = "take the New York-San Francisco flight",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens.map(toString), ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight'])
})

test("splitting strings with hyphens and spaces", function () {
  var simpleString = "Solve for A - B",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens.map(toString), ['solve', 'for', 'a', 'b'])
})

test("storing the token index", function () {
  var str = "foo bar",
      tokens = lunr.tokenizer(str)

  equal(tokens[0].metadata.index, 0)
  equal(tokens[1].metadata.index, 1)
})

test("storing the token position", function () {
  var str = "foo hurp",
      tokens = lunr.tokenizer(str)

  deepEqual(tokens[0].metadata.position, [0, 3])
  deepEqual(tokens[1].metadata.position, [4, 4])
})
