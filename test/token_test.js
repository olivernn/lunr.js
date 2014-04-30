module('lunr.Token')

test('comparison with plain strings', function () {
  var token = new lunr.Token ('b')

  ok(token < 'c')
  ok(token == 'b')
  ok(token > 'a')
})

test('used as keys in an object', function () {
  var t1 = new lunr.Token ('a'),
      t2 = new lunr.Token ('b'),
      obj = {}

  obj[t1] = 1
  obj[t2] = 2

  equal(obj[t1], 1)
  equal(obj[t2], 2)

  equal(obj['a'], 1)
  equal(obj['b'], 2)
})

test('containsWildcard', function () {
  var noWildcard = new lunr.Token ('foo'),
      leadingWildcard = new lunr.Token ('*foo')
      trailingWildcard = new lunr.Token ('foo*'),
      middleWildcard = new lunr.Token ('fo*o')

  ok(!noWildcard.containsWildcard())
  ok(leadingWildcard.containsWildcard())
  ok(trailingWildcard.containsWildcard())
  ok(middleWildcard.containsWildcard())
})

test('prefix', function () {
  var leadingWildcard = new lunr.Token ('*foo')
      trailingWildcard = new lunr.Token ('foo*'),
      middleWildcard = new lunr.Token ('fo*o')

  equal(leadingWildcard.prefix(), '')
  equal(trailingWildcard.prefix(), 'foo')
  equal(middleWildcard.prefix(), 'fo')
})

test('suffix', function () {
  var leadingWildcard = new lunr.Token ('*foo')
      trailingWildcard = new lunr.Token ('foo*'),
      middleWildcard = new lunr.Token ('fo*o')

  equal(leadingWildcard.suffix(), 'foo')
  equal(trailingWildcard.suffix(), '')
  equal(middleWildcard.suffix(), 'o')
})

test('similarity', function () {
  var token = new lunr.Token('foo'),
      s1 = 'foo',
      s2 = 'food',
      s3 = 'foolish',
      s4 = 'foolhardy'

  equal(token.similarity(s1), 1)

  ok(token.similarity(s2) < 1)
  ok(token.similarity(s3) < 1)
  ok(token.similarity(s4) < 1)

  ok(token.similarity(s1) > token.similarity(s2))
  ok(token.similarity(s2) > token.similarity(s3))
  ok(token.similarity(s3) > token.similarity(s4))
})

test('toJSON', function () {
  var token = new lunr.Token ('foo')
  equal(token.toJSON(), 'foo')
})

test('transform', function () {
  var t1 = new lunr.Token ('foo')

  var t2 = t1.transform(function (s) {
    equal(s, 'foo')
    return 'bar'
  })

  equal(t2.toString(), 'bar')
})
