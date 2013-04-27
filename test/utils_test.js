module('lunr.utils')

test('zeroFillArray', function() {
  var arr = lunr.utils.zeroFillArray(10)

  equal(arr.length, 10)
  ok(arr.every(function (el) { return el === 0 }))
  ok(arr !== lunr.utils.zeroFillArray(10))
})

