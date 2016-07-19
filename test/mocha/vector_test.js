suite('lunr.Vector', function () {
  var vectorFromArgs = function () {
    var vector = new lunr.Vector

    Array.prototype.slice.call(arguments)
      .forEach(function (el, i) {
        vector.insert(i, el)
      })

    return vector
  }

  suite('#magnitude', function () {
    test('calculates magnitude of a vector', function () {
      var vector = vectorFromArgs(4,5,6)
      assert.equal(Math.sqrt(77), vector.magnitude())
    })
  })

  suite('#dot', function () {
    test('calculates dot product of two vectors', function () {
      var v1 = vectorFromArgs(1, 3, -5),
          v2 = vectorFromArgs(4, -2, -1)

      assert.equal(3, v1.dot(v2))
    })
  })

  suite('#similarity', function () {
    test('calculates the similarity between two vectors', function () {
      var v1 = vectorFromArgs(1, 3, -5),
          v2 = vectorFromArgs(4, -2, -1)

      assert.approximately(v1.similarity(v2), 0.111, 0.001)
    })
  })

  suite('#insert', function () {
    test('invalidates magnitude cache', function () {
      var vector = vectorFromArgs(4,5,6)

      assert.equal(Math.sqrt(77), vector.magnitude())

      vector.insert(3, 7)

      assert.equal(Math.sqrt(126), vector.magnitude())
    })

    test('keeps items in index specified order', function () {
      var vector = new lunr.Vector

      vector.insert(2, 4)
      vector.insert(1, 5)
      vector.insert(0, 6)

      assert.deepEqual([6,5,4], vector.toArray())
    })
  })
})
