// TODO: fix the naming for this object
module('lunr.TokenSet')

test('toString includes whether node is final', function () {
  var nonFinal = new lunr.TokenSet,
      final = new lunr.TokenSet,
      otherFinal = new lunr.TokenSet

  final.final = true
  otherFinal.final = true

  notEqual(nonFinal.toString(), final.toString())
  equal(otherFinal.toString(), final.toString())
})

test('toString includes all edges', function () {
  var noEdges = new lunr.TokenSet,
      oneEdge = new lunr.TokenSet,
      twoEdges = new lunr.TokenSet

  oneEdge.edges['a'] = 1
  twoEdges.edges['a'] = 1
  twoEdges.edges['b'] = 1

  notEqual(noEdges.toString(), oneEdge.toString())
  notEqual(twoEdges.toString(), oneEdge.toString())
  notEqual(twoEdges.toString(), noEdges.toString())
})

test('toString includes child toString', function () {
  var a = new lunr.TokenSet,
      b = new lunr.TokenSet,
      c = new lunr.TokenSet

  a.edges['x'] = 1
  b.edges['x'] = 2
  c.edges['x'] = 1

  notEqual(a.toString(), b.toString())
  equal(a.toString(), c.toString())
})

test('fromString without special characters', function () {
  var x = lunr.TokenSet.fromString('a')

  equal(x.toString(), '0a1')
  ok(x.edges['a'].final)
})

test('fromString with a trailing wildcard', function () {
  var x = lunr.TokenSet.fromString('a*'),
      wild = x.edges['a'].edges['*']

  // a state reached by a wildcard has an
  // edge with wildcard to itself, making
  // the resultant automota non-determenistic
  deepEqual(wild, wild.edges['*'])
})

test('fromArray unsorted', function () {
  throws(function () {
    lunr.TokenSet.fromArray(['z', 'a'])
  })
})

test('fromArray sorted', function () {
  var words = ['bar', 'baz'],
      set = lunr.TokenSet.fromArray(words)

  deepEqual(words.sort(), set.toArray().sort())
})

test('fromArray creates a minimal number of nodes', function () {
  var words = ['tuesday', 'thursday'].sort(),
      set = lunr.TokenSet.fromArray(words),
      counters = {}

  words.forEach(function (word) {
    Array.prototype.reduce.call(word, function (node, char) {
      node = node.edges[char]

      if (!(node in counters)) {
        counters[node] = 0
      }

      counters[node] += 1

      return node
    }, set)
  })

  var counts = Object
    .keys(counters)
    .map(function (k) { return counters[k] })

  ok(Math.max.apply(null, counts) > 1)
})

test('toArray with a single word', function () {
  var x = lunr.TokenSet.fromString('foo')
  deepEqual(x.toArray() ['foo'])
})

test('intersect no intersection', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('bar')
      z = x.intersect(y)

  deepEqual(z.toArray(), [])
})

test('intersect with simple intersection', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('foo'),
      z = x.intersect(y)

  deepEqual(z.toArray() ['foo'])
})

test('intersect with trailing wildcard matching', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('f*'),
      z = x.intersect(y)

  deepEqual(z.toArray(), ['foo'])
})

test('intersect with trailing wildcard no matches', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('b*'),
      z = x.intersect(y)

  deepEqual(z.toArray(), [])
})

test('intersect with leading wildcard matching', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('*oo'),
      z = x.intersect(y)

  deepEqual(z.toArray(), ['foo'])
})

test('intersect with leading wildcard no matches', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('*ar'),
      z = x.intersect(y)

  deepEqual(z.toArray(), [])
})

test('intersect with contained wildcard matching', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('f*o'),
      z = x.intersect(y)

  deepEqual(z.toArray(), ['foo'])
})

test('intersect with contained wildcard no matches', function () {
  var x = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromString('b*r'),
      z = x.intersect(y)

  deepEqual(z.toArray(), [])
})

