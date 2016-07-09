module("lunr.QueryLexer")

test("one term", function () {
  var lexer = new lunr.QueryLexer("foo")
  lexer.run()

  equal(lexer.lexemes.length, 1)
  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 0,
    end: 3
  })
})

test("two terms", function () {
  var lexer = new lunr.QueryLexer("foo bar")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 0,
    end: 3
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "bar",
    start: 4,
    end: 7
  })
})

test("two terms with seperator length > 1", function () {
  var lexer = new lunr.QueryLexer("foo    bar")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 0,
    end: 3
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "bar",
    start: 7,
    end: 10
  })
})

test("term with field", function () {
  var lexer = new lunr.QueryLexer("title:foo")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.FIELD,
    str: "title",
    start: 0,
    end: 5
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 6,
    end: 9
  })
})

test("term with edit distance", function () {
  var lexer = new lunr.QueryLexer("foo~2")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 0,
    end: 3
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.EDIT_DISTANCE,
    str: "2",
    start: 4,
    end: 5
  })
})

test("term with boost", function () {
  var lexer = new lunr.QueryLexer("foo^10")
  lexer.run()

  equal(lexer.lexemes.length, 2)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 0,
    end: 3
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.BOOST,
    str: "10",
    start: 4,
    end: 6
  })
})

test("term with field and boost and edit distance", function () {
  var lexer = new lunr.QueryLexer("title:foo^10~5")
  lexer.run()

console.log(lexer.lexemes)

  equal(lexer.lexemes.length, 4)

  deepEqual(lexer.lexemes[0], {
    type: lunr.QueryLexer.FIELD,
    str: "title",
    start: 0,
    end: 5
  })

  deepEqual(lexer.lexemes[1], {
    type: lunr.QueryLexer.TERM,
    str: "foo",
    start: 6,
    end: 9
  })

  deepEqual(lexer.lexemes[2], {
    type: lunr.QueryLexer.BOOST,
    str: "10",
    start: 10,
    end: 12
  })

  deepEqual(lexer.lexemes[3], {
    type: lunr.QueryLexer.EDIT_DISTANCE,
    str: "5",
    start: 13,
    end: 14
  })
})
