lunr.Trie = function (root) {
  this.root = root || {}
}

lunr.Trie.load = function (serialised) {
  return new lunr.Trie (serialised)
}

lunr.Trie.stopSymbol = '$$'

lunr.Trie.prototype.add = function (str) {
  var char, node = this.root

  for (var i = 0, len = str.length; i < len; i++) {
    char = str[i]
    if (!node[char]) node[char] = {}
    node = node[char]
  }

  node[lunr.Trie.stopSymbol] = 1
}

lunr.Trie.prototype.remove = function (str) {
  var char, node = this.root

  for (var i = 0, len = str.length; i < len; i++) {
    char = str[i]
    if (!node[char]) return
    node = node[char]
  }

  delete node[lunr.Trie.stopSymbol]
}

lunr.Trie.prototype.has = function (str) {
  var char, node = this.root

  for (var i = 0, len = str.length; i < len; i++) {
    char = str[i]
    if (!node[char]) return false
    node = node[char]
  }

  return !!node[lunr.Trie.stopSymbol]
}

lunr.Trie.prototype.suffixes = function (str) {
  var char,
      node = this.root,
      tokens = new lunr.SortedSet,
      chars = []

  for (var i = 0, len = str.length; i < len; i++) {
    char = str[i]
    if (!node[char]) return tokens
    node = node[char]
  }

  return this.traverse(node, str, tokens)
}

lunr.Trie.prototype.traverse = function (node, prefix, tokens) {
  Object.keys(node).forEach(function (char) {
    if (char == lunr.Trie.stopSymbol) {
      tokens.add(prefix)
    } else {
      this.traverse(node[char], prefix + char, tokens)
    }
  }, this)

  return tokens
}

lunr.Trie.prototype.toJSON = function () {
  return this.root
}
