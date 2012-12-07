module('lunr.Store')

test('adding document tokens to the document store', function () {
  var docStore = new lunr.Store,
      tokens = ['eggs', 'ham']

  docStore.set(1, tokens)
  deepEqual(docStore.get(1), tokens)
})

test('getting the number of items in the document store', function () {
  var docStore = new lunr.Store

  equal(docStore.length, 0)
  docStore.set(1, 'foo')
  equal(docStore.length, 1)
})

test('pushing a value to an empty key', function () {
  var store = new lunr.Store

  ok(!store.get('foo'))
  store.push('foo', 1)
  ok(!!store.get('foo'))
  deepEqual(store.get('foo'), [1])
})

test('checking whether the store contains a key', function () {
  var store = new lunr.Store

  ok(!store.has('foo'))
  store.set('foo', 1)
  ok(store.has('foo'))
})
