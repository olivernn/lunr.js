module('lunr.ngramtokenizer')

test("splitting a string into 2-grams", function () {
  var tokens = lunr.ngramtokenizer(2)("simple string");
  deepEqual(tokens, ["\u0002s", "si", "im", "mp",
            "pl", "le", "e ", " s", "st", "tr",
            "ri", "in", "ng", "g\u0003"]);
})

test("splitting a string into 3-grams", function() {
  var tokens = lunr.ngramtokenizer(3)("simple string");
  deepEqual(tokens, ["\u0002si", "sim", "imp", "mpl",
            "ple", "le ", "e s", " st", "str", "tri",
            "rin", "ing", "ng\u0003"]);
})

test("downcases all tokens", function() {
  var tokens = lunr.ngramtokenizer(3)("AlEiN");
  deepEqual(tokens, ["\u0002al", "ale", "lei", "ein","in\u0003"]);
})

test("does not exclude characters", function () {
  var tokens = lunr.ngramtokenizer(3)("!@#$%");
  deepEqual(tokens, ["\u0002!@", "!@#", "@#$", "#$%","$%\u0003"]);
})
