module('Trie')

test("setting an object then getting its value", function () {
  var trie = new Lunr.Trie,
      obj = {val: 'bar'}

  trie.set('foo', obj)
  equal(trie.get('foo')[0].val, obj.val)
})

test("get all the keys that match the input key", function () {
  var trie = new Lunr.Trie

  trie.set('foo', 1)
  trie.set('foobar', 1)
  trie.set('foobarbaz', 1)
  trie.set('bar', 1)

  same(trie.keys('foo'), ['foo', 'foobar', 'foobarbaz'])
  same(trie.keys('foob'), ['foobar', 'foobarbaz'])
  same(trie.keys('foobarb'), ['foobarbaz'])
  same(trie.keys('b'), ['bar'])
})

test("get all the objects that match the input key", function () {
  var trie = new Lunr.Trie
  trie.set('foo', {val: 'foo'})
  trie.set('foobar', {val: 'foobar'})
  trie.set('foobarbaz', {val: 'foobarbaz'})
  trie.set('bar', {val: 'bar'})

  equal(trie.get('foo').length, 3)
  equal(trie.get('foob').length, 2)
  equal(trie.get('b').length, 1)
})
