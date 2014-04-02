module('lunr.TokenStore')

test('adding a token to the store', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 },
      token = new lunr.Token ('foo')

  store.add(token, doc)

  ok(store.store['foo'][123] === doc)
  equal(store.length, 1)
})

test('adding another document to the token', function () {
  var store = new lunr.TokenStore,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 456, tf: 1 },
      token = new lunr.Token ('foo')

  store.add(token, doc1)
  store.add(token, doc2)

  ok(store.store['foo'][123] === doc1)
  ok(store.store['foo'][456] === doc2)
})

test('checking if a token exists in the store', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 },
      token = new lunr.Token ('foo')

  store.add(token, doc)

  ok(store.has(token))
})

test('checking if a token does not exist in the store', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 },
      token = new lunr.Token ('foo')

  ok(!store.has('bar'))
  store.add(token, doc)
  ok(!store.has('bar'))
})

test('retrieving items from the store', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 },
      token = new lunr.Token ('foo')

  store.add(token, doc)
  deepEqual(store.get(token), {
    '123': doc
  })

  deepEqual(store.get(''), {})
})

test('retrieving items that do not exist in the store', function () {
  var store = new lunr.TokenStore

  deepEqual(store.get('foo'), {})
})

test('counting items in the store', function () {
  var store = new lunr.TokenStore,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 456, tf: 1 },
      doc3 = { ref: 789, tf: 1 }

  store.add('foo', doc1)
  store.add('foo', doc2)
  store.add('bar', doc3)

  equal(store.count('foo'), 2)
  equal(store.count('bar'), 1)
  equal(store.count('baz'), 0)
})

test('removing a document from the token store', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 }

  deepEqual(store.get('foo'), {})
  store.add('foo', doc)
  deepEqual(store.get('foo'), {
    '123': doc
  })

  store.remove('foo', 123)
  deepEqual(store.get('foo'), {})
})

test('removing a document that is not in the store', function () {
  var store = new lunr.TokenStore,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 567, tf: 1 }

  store.add('foo', doc1)
  store.add('bar', doc2)
  store.remove('foo', 456)

  deepEqual(store.get('foo'), { 123: doc1 })
})

test('removing a document from a key that does not exist', function () {
  var store = new lunr.TokenStore

  store.remove('foo', 123)
  ok(!store.has('foo'))
})

test('expanding trailing wildcard', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 }

  store.add(new lunr.Token ('tell'), doc)
  store.add(new lunr.Token ('hell'), doc)
  store.add(new lunr.Token ('hello'), doc)
  store.add(new lunr.Token ('help'), doc)
  store.add(new lunr.Token ('heap'), doc)
  store.add(new lunr.Token ('held'), doc)
  store.add(new lunr.Token ('foo'), doc)
  store.add(new lunr.Token ('bar'), doc)

  var tokens = store.expand(new lunr.Token ('hel*'))

  ok(tokens.indexOf('hell') > -1)
  ok(tokens.indexOf('hello') > -1)
  ok(tokens.indexOf('help') > -1)
  ok(tokens.indexOf('held') > -1)

  equal(tokens.length, 4)
})

test('expanding leading wildcard', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 }

  store.add(new lunr.Token ('tell'), doc)
  store.add(new lunr.Token ('hell'), doc)
  store.add(new lunr.Token ('hello'), doc)
  store.add(new lunr.Token ('help'), doc)
  store.add(new lunr.Token ('heap'), doc)
  store.add(new lunr.Token ('held'), doc)
  store.add(new lunr.Token ('foo'), doc)
  store.add(new lunr.Token ('bar'), doc)

  var tokens = store.expand(new lunr.Token ('*ell'))

  ok(tokens.indexOf('tell') > -1)
  ok(tokens.indexOf('hell') > -1)

  equal(tokens.length, 2)
})

test('expanding inside wildcard', function () {
  var store = new lunr.TokenStore,
      doc = { ref: 123, tf: 1 }

  store.add(new lunr.Token ('tell'), doc)
  store.add(new lunr.Token ('hell'), doc)
  store.add(new lunr.Token ('hello'), doc)
  store.add(new lunr.Token ('help'), doc)
  store.add(new lunr.Token ('heap'), doc)
  store.add(new lunr.Token ('held'), doc)
  store.add(new lunr.Token ('foo'), doc)
  store.add(new lunr.Token ('bar'), doc)

  var tokens = store.expand(new lunr.Token ('he*p'))

  ok(tokens.indexOf('help') > -1)
  ok(tokens.indexOf('heap') > -1)

  equal(tokens.length, 2)
})

test('serialisation', function () {
  var store = new lunr.TokenStore

  deepEqual(store.toJSON(), { length: 0, store: {}, forwards: {}, backwards: {}})

  store.add('foo', { ref: 123, tf: 1 })

  deepEqual(store.toJSON(), {
    length: 1,
    forwards: {
      'f': {
        'o': {
          'o': {
            '$$':1
            }
          }
        }
      },
      backwards: {
        'o': {
          'o': {
            'f': {
              '$$':1
            }
          }
        }
      },
      store: {
        'foo': {
          123: { ref: 123, tf: 1 }
        }
      }
    })
})

test('loading a serialised story', function () {
  var serialisedData = {
    forwards: {
      f: {
        o: {
          o: {
            $$: 1
          }
        }
      }
    },
    backwards: {
      o: {
        o: {
          f: {
            $$: 1
          }
        }
      }
    },
    store: {
      foo: {
        123: { tf: 1, ref: 123 }
      }
    },
    length: 1
  }

  var store = lunr.TokenStore.load(serialisedData),
      documents = store.get('foo')

  equal(store.length, 1)
  deepEqual(documents, { 123: { ref: 123, tf: 1 }})
})
