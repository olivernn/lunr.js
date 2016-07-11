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

test('intersect with fuzzy string matching no edit', function () {
  var x = lunr.TokenSet.fromString('bar'),
      y = lunr.TokenSet.fromFuzzyString('bar', 1)
      z = x.intersect(y)

  deepEqual(z.toArray(), ["bar"])
})

test('intersect with fuzzy string substitution', function () {
  var x1 = lunr.TokenSet.fromString('bar'),
      x2 = lunr.TokenSet.fromString('cur'),
      x3 = lunr.TokenSet.fromString('cat'),
      x4 = lunr.TokenSet.fromString('car'),
      x5 = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromFuzzyString('car', 1)

  deepEqual(x1.intersect(y).toArray(), ["bar"])
  deepEqual(x2.intersect(y).toArray(), ["cur"])
  deepEqual(x3.intersect(y).toArray(), ["cat"])
  deepEqual(x4.intersect(y).toArray(), ["car"])
  deepEqual(x5.intersect(y).toArray(), [])
})

test('intersect with fuzzy string deletion', function () {
  var x1 = lunr.TokenSet.fromString('ar'),
      x2 = lunr.TokenSet.fromString('br'),
      x3 = lunr.TokenSet.fromString('ba'),
      x4 = lunr.TokenSet.fromString('bar'),
      x5 = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromFuzzyString('bar', 1)

  deepEqual(x1.intersect(y).toArray(), ["ar"])
  deepEqual(x2.intersect(y).toArray(), ["br"])
  deepEqual(x3.intersect(y).toArray(), ["ba"])
  deepEqual(x4.intersect(y).toArray(), ["bar"])
  deepEqual(x5.intersect(y).toArray(), [])
})

test('intersect with fuzzy string insertion', function () {
  var x1 = lunr.TokenSet.fromString('bbar'),
      x2 = lunr.TokenSet.fromString('baar'),
      x3 = lunr.TokenSet.fromString('barr'),
      x4 = lunr.TokenSet.fromString('bar'),
      x5 = lunr.TokenSet.fromString('ba'),
      x6 = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromFuzzyString('bar', 1)

  deepEqual(x1.intersect(y).toArray(), ["bbar"])
  deepEqual(x2.intersect(y).toArray(), ["baar"])
  deepEqual(x3.intersect(y).toArray(), ["barr"])
  deepEqual(x4.intersect(y).toArray(), ["bar"])
  deepEqual(x5.intersect(y).toArray(), ["ba"])
  deepEqual(x6.intersect(y).toArray(), [])
})

test('intersect with fuzzy string transpose', function () {
  var x1 = lunr.TokenSet.fromString('abr'),
      x2 = lunr.TokenSet.fromString('bra'),
      x3 = lunr.TokenSet.fromString('foo'),
      y = lunr.TokenSet.fromFuzzyString('bar', 1)

  deepEqual(x1.intersect(y).toArray(), ["abr"])
  deepEqual(x2.intersect(y).toArray(), ["bra"])
  deepEqual(x3.intersect(y).toArray(), [])
})
