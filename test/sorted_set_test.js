module('lunr.SortedSet')

test('adding an element that doesn\'t exist into the set', function () {
  var set = new lunr.SortedSet

  equal(set.length, 0)
  set.add('foo')
  equal(set.length, 1)
})

test('adding an element that does exist into the set', function () {
  var set = new lunr.SortedSet
  set.add('foo')
  equal(set.length, 1)

  set.add('foo')
  equal(set.length, 1)
})

test('adding more than one element to the set in one go', function () {
  var set = new lunr.SortedSet
  set.add('foo', 'bar', 'baz', 'foo')
  equal(set.length, 3)
})

test('converting to an array', function () {
  var set = new lunr.SortedSet
  set.add('foo', 'bar', 'baz')
  deepEqual(set.toArray(), ['bar', 'baz', 'foo'])
})

test('mapping the set', function () {
  var set = new lunr.SortedSet, a = []

  set.add('foo', 'bar')

  set.forEach(function (t) { a.push(t) })

  deepEqual(a, ['bar', 'foo'])
})

test('getting the index of an item in the set', function () {
  var set = new lunr.SortedSet

  set.add('foo', 'bar')

  equal(set.indexOf('foo'), 1)
  equal(set.indexOf('bar'), 0)
  equal(set.indexOf('non member'), -1)
})
