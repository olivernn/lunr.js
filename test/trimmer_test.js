module('lunr.trimmer')

test('latin characters', function () {
  equal_with_strings(lunr.trimmer, 'hello')
})

test('removing leading and trailing punctuation', function () {
  equal_with_strings(lunr.trimmer, "hello.", "hello")
  equal_with_strings(lunr.trimmer, "it's")
  equal_with_strings(lunr.trimmer, "james'", "james")
  equal_with_strings(lunr.trimmer, "stop!", "stop")
  equal_with_strings(lunr.trimmer, "first,", "first")
  equal_with_strings(lunr.trimmer, "[tag]", "tag")
})

test('leaving wildcards intact', function () {
  equal_with_strings(lunr.trimmer, "hello* ", "hello*")
  equal_with_strings(lunr.trimmer, " *,hello", "*hello")
  equal_with_strings(lunr.trimmer, "hel*o", "hel*o")
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.trimmer.label, 'trimmer')
  deepEqual(lunr.Pipeline.registeredFunctions['trimmer'], lunr.trimmer)
})
