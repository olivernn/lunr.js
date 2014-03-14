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

test('serialisation', function () {
  var trie = new lunr.Trie

  deepEqual(trie.toJSON(), { })

  trie.add('foo')
  trie.add('bar')
  trie.add('baz')

  deepEqual(trie.toJSON(), {
    'b': {
      'a': {
        'r': {
          '$$': 1
        },
        'z': {
         '$$': 1
        }
      }
    },
    'f': {
      'o': {
        'o': {
          '$$': 1
        }
      }
    }
  })
})

test('loading a serialised trie', function () {
  var serialised = {
    'b': {
      'a': {
        'r': {
          '$$': 1
        },
        'z': {
         '$$': 1
        }
      }
    },
    'f': {
      'o': {
        'o': {
          '$$': 1
        }
      }
    }
  }

  var trie = lunr.Trie.load(serialised)

  ok(trie.has('foo'))
  ok(trie.has('bar'))
  ok(trie.has('baz'))
  ok(!trie.has('bad'))
})

