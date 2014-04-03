module("lunr.Vector")

test("calculating the magnitude of a vector", function () {
  var vector = new lunr.Vector,
      elements = [4,5,6]

  elements.forEach(function (el, i) { vector.insert(i, el) })

  equal(vector.magnitude(), Math.sqrt(77))
})

test("calculating the dot product with another vector", function () {
  var v1 = new lunr.Vector,
      v2 = new lunr.Vector,
      els1 = [1, 3, -5],
      els2 = [4, -2, -1]


  els1.forEach(function (el, i) { v1.insert(i, el) })
  els2.forEach(function (el, i) { v2.insert(i, el) })

  equal(v1.dot(v2), 3)
})

test("calculating the similarity between two vectors", function () {
  var v1 = new lunr.Vector,
      v2 = new lunr.Vector,
      els1 = [1, 3, -5],
      els2 = [4, -2, -1]

  els1.forEach(function (el, i) { v1.insert(i, el) })
  els2.forEach(function (el, i) { v2.insert(i, el) })

  var similarity = v1.similarity(v2),
      roundedSimilarity = Math.round(similarity * 1000) / 1000

  equal(roundedSimilarity, 0.111)
})

test("inserting out of order", function () {
  var v = new lunr.Vector

  v.insert(3, 'a')
  v.insert(2, 'b')
  v.insert(1, 'c')

  equal(v.list.idx, 1)
  equal(v.last.idx, 3)

  equal(v.list.val, 'c')
  equal(v.last.val, 'a')
})
