module("vector")

test("calculating the magnitude of a vector", function () {
  var vector = new lunr.Vector ([4, 5, 6])

  equal(vector.magnitude(), Math.sqrt(77))
})

test("calculating the dot product with another vector", function () {
  var v1 = new lunr.Vector ([1, 3, -5]),
      v2 = new lunr.Vector ([4, -2, -1])

  equal(v1.dot(v2), 3)
})

test("calculating the similarity between two vectors", function () {
  var v1 = new lunr.Vector ([1, 3, -5]),
      v2 = new lunr.Vector ([4, -2, -1]),
      similarity = v1.similarity(v2),
      roundedSimilarity = Math.round(similarity * 1000) / 1000

  equal(roundedSimilarity, 0.111)
})

test("padding vectors so they have at least two elements", function() {
  var v1 = new lunr.Vector ([1])
  equal(v1.elements.length, 2)
})

test('zero filling vectors created with sparse arrays', function () {
  var v1 = new lunr.Vector (new Array (10))
  equal(v1.elements.length, 10)
  ok(v1.elements.every(function (el) { return el !== undefined }))
})
