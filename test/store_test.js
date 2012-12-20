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
  var store = new lunr.Store,
      doc = { ref: 123, tf: 1 }

  ok(!store.get('foo'))
  store.push('foo', doc)
  ok(!!store.get('foo'))
  deepEqual(store.get('foo')[123], doc)
})

test('checking whether the store contains a key', function () {
  var store = new lunr.Store

  ok(!store.has('foo'))
  store.set('foo', 1)
  ok(store.has('foo'))
})

test('removing an element from the store', function () {
  var store = new lunr.Store

  store.set('foo', 1)
  ok(store.has('foo'))
  equal(store.length, 1)
  store.remove('foo')
  ok(!store.has('foo'))
  equal(store.length, 0)
})

test('rejecting an element from an array in the store', function () {
  var store = new lunr.Store,
      doc = { ref: 123, tf: 1 }

  store.push('foo', doc)
  ok(store.has('foo'))
  equal(store.length, 1)
  ok('123' in store.get('foo'))

  store.reject('foo', 123)
  ok(!store.has('foo'))
  equal(store.length, 0)
})
