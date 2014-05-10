module("lunr.StringScanner")

var extractSubstrings = function (stringScanner) {
  var substrings = []
  stringScanner.forEach(function () { substrings.push(Array.prototype.slice.call(arguments)) })
  return substrings
}

var substringsCount = function (stringScanner, expectedCount) {
  equal(extractSubstrings(stringScanner).length, expectedCount)
}

var substringsYieldedEqual = function (stringScanner, argIndex, expected) {
  deepEqual(extractSubstrings(stringScanner).map(function (args) { return args[argIndex] }), expected)
}

test("yeilding substrings", function () {
  var stringScanner = new lunr.StringScanner ("this is a simple string")
  substringsCount(stringScanner, 5)
  substringsYieldedEqual(stringScanner, 0, ["this", "is", "a", "simple", "string"])
})

test("handling a run of whitespace", function () {
  var stringScanner = new lunr.StringScanner ("   foo   bar   baz   ")
  substringsCount(stringScanner, 3)
  substringsYieldedEqual(stringScanner, 0, ["foo", "bar", "baz"])
})

test("yielding start index and length of substring", function () {
  var stringScanner = new lunr.StringScanner ("  foo bar  foobar a ")
  substringsYieldedEqual(stringScanner, 1, [2,6,11,18])
  substringsYieldedEqual(stringScanner, 2, [3,3,6,1])
})
