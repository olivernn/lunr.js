module('lunr.Trie')

test('adding a string', function () {
  var trie = new lunr.Trie,
      str = 'foo'

  trie.add(str)

  ok(trie.has(str))
})

test('checking existence of a string', function () {
  var trie = new lunr.Trie,
      str = 'foo', longer_str = 'food'

  trie.add(longer_str)
  ok(!trie.has(str))
  trie.add(str)
  ok(trie.has(str))
})

test('removing a string', function () {
  var trie = new lunr.Trie,
      str = 'foo'

  trie.add(str)
  ok(trie.has(str))
  trie.remove(str)
  ok(!trie.has(str))
})

test('getting suffixes', function () {
  var trie = new lunr.Trie,
      strs = [
        'hello',
        'help',
        'hell',
        'heat',
        'foo'
      ]

  strs.forEach(function (str) { trie.add(str) })

  var suffixes = trie.suffixes('hel')

  ok(suffixes.indexOf('hello') > -1)
  ok(suffixes.indexOf('help') > -1)
  ok(suffixes.indexOf('hell') > -1)
})
