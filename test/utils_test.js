module('utils')

test("intersect should return an array with the common elements from arrays", function () {
  var a = [1,2,3],
      b = [2,3,4],
      out = Lunr.utils.intersect(a, b)

  same([2,3], out, 'should return an array with the intersection of the input')
})

test("intersect can take any amount of arrays", function () {
  var a = [1,2,3],
      b = [2,3,4],
      c = [3,4,5],
      out = Lunr.utils.intersect(a,b,c)

  same([3], out, 'should return an array with the intersection of the input')
})

test("uniq should return a copy of the array with duplicates removed", function () {
  var a = [1,1,2,2,3],
      out = Lunr.utils.uniq(a)

  same([1,2,3], out, 'should return an array with duplicated removed')
})

test("uniq called without any args should return an empty array", function () {
  var out = Lunr.utils.uniq()
  same([], out, 'should return an empty array')
})

test("copy should return an exacte copy of the input object", function () {
  var a = { foo: 'bar' },
      out = Lunr.utils.copy(a)

  same(a, out, 'should return a copy of the input object')
  a.bar = 'baz'
  ok(!('bar' in out), 'should not be a reference to a')
})

test("eachKey should iterate over each key of an object yeilding the key each time", function () {
  var a = { foo: 1, bar: 2 },
      count = 0

  Lunr.utils.forEachKey(a, function (key) {
    ok((key in a), 'should only yield keys that are in obj')
    count++
  })

  equal(2, count, 'should yeild for each key in the obj')
})

test("mapKeys should map an objects keys", function () {
  var a = { foo: 1, bar: 2 }

  var out = Lunr.utils.mapKeys(a, function (key) {
    return key.toUpperCase()
  })

  same(['FOO', 'BAR'], out, 'should call the fn for each key and then return an array with the result')
})
