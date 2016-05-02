module("lunr.QueryLexer")

test("one term", function () {
  var lexer = new lunr.QueryLexer("foo")
  lexer.run()

  equal(lexer.lexemes.length, 1)
  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })
})

test("two terms", function () {
  var lexer = new lunr.QueryLexer("foo bar")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "bar"
  })
})

test("two terms with seperator length > 1", function () {
  var lexer = new lunr.QueryLexer("foo    bar")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "bar"
  })
})

test("term with field", function () {
  var lexer = new lunr.QueryLexer("title:foo")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.FIELD,
    str: "title"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })
})

test("term with edit distance", function () {
  var lexer = new lunr.QueryLexer("foo~2")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.EDIT_DISTANCE,
    str: "2"
  })
})

test("term with boost", function () {
  var lexer = new lunr.QueryLexer("foo^10")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.BOOST,
    str: "10"
  })
})

test("term with field and boost and edit distance", function () {
  var lexer = new lunr.QueryLexer("title:foo^10~5")
  lexer.run()

console.log(lexer.lexemes)

  equal(lexer.lexemes.length, 4)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.FIELD,
    str: "title"
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "foo"
  })

  deepEqual(lexer.lexemes[2], {
    type: lunr.QueryLexer.BOOST,
    str: "10"
  })

  deepEqual(lexer.lexemes[3], {
    type: lunr.QueryLexer.EDIT_DISTANCE,
    str: "5"
  })
})
