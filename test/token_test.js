module("lunr.Token")

test("can be converted to a string", function () {
  var token = new lunr.Token ("foo")
  equal(token.toString(), "foo")
})

test("has attached metadata", function () {
  var token = new lunr.Token ("foo", { length: 3 })
  equal(token.metadata.length, 3)
})

test("can be updated", function () {
  var token = new lunr.Token ("foo")

  token.update(function (s) {
    return s.toUpperCase()
  })

  equal(token.toString(), "FOO")
})

test("metadata available when updating", function () {
  var token = new lunr.Token ("foo", { bar: true }),
      yieldedMetadata = null

  token.update(function (_, md) {
    yieldedMetadata = md
  })

  deepEqual({bar: true}, yieldedMetadata)
})

test("can clone a token", function () {
  var token = new lunr.Token ("foo", { bar: true }),
      clone = token.clone()

  equal(token.toString(), clone.toString())
  equal(token.metadata.bar, clone.metadata.bar)
})

test("can clone a modified token", function () {
  var token = new lunr.Token ("foo", { bar: true })
      clone = token.clone(function (s) { return s.toUpperCase() })

  equal(token.toString(), "foo")
  equal(clone.toString(), "FOO")
  equal(token.metadata.bar, clone.metadata.bar)
})
