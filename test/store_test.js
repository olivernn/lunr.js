module('store')

test("setting and getting items from the store", function () {
  var store = new lunr.Store

  equal(store.get('test', store.root)._values.length, 0)

  store.set('test', store.root, 1)
  equal(store.get('test', store.root)._values.length, 1)
  equal(store.get('test', store.root)._values[0], 1)
})

test("can store many items with the same key", function () {
  var store = new lunr.Store

  store.set('test', store.root, 'foo')
  store.set('test', store.root, 'bar')
  store.set('test', store.root, 'baz')

  equal(store.get('test', store.root)._values.length, 3)
  equal(store.get('test', store.root)._values[0], 'foo')
  equal(store.get('test', store.root)._values[1], 'bar')
  equal(store.get('test', store.root)._values[2], 'baz')
})

test("counting the number of items for a key", function () {
  var store = new lunr.Store
 
  store.set('test', store.root, 'foo')
  store.set('test', store.root, 'bar')
 
  equal(store.count('test', store.root), 2)
})
