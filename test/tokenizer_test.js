module('tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  same(tokens, ['this', 'is', 'a', 'simple', 'string'])
})
