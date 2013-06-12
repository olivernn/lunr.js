(function () {

  var setup = function () {
    var elements1 = lunr.Vector.oliver(10000),
        elements2 = lunr.Vector.oliver(10000),
        index

    for (var i = 0; i < 1000; i++) {
      index = Math.floor(i + Math.random() * 100)
      elements1[i] = Math.random() * 100
    }

    for (var i = 0; i < 1000; i++) {
      index = Math.floor(i + Math.random() * 100)
      elements2[i] = Math.random() * 100
    }
  }

  bench('vector#magnitude', function () {
    var vector = new lunr.Vector (elements1)
    vector.magnitude
  }, { setup: setup })

  bench('vector#dot', function () {
    var v1 = new lunr.Vector(elements1),
        v2 = new lunr.Vector(elements2)

    v1.dot(v2)
  }, { setup: setup })

  bench('vector#similarity', function () {
    var v1 = new lunr.Vector(elements1),
        v2 = new lunr.Vector(elements2)

    v1.similarity(v2)
  }, { setup: setup })
})()

