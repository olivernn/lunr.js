lunr.Trie = function () {
  this.root = {}
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
      set = new lunr.SortedSet,
      chars = []

  for (var i = 0, len = str.length; i < len; i++) {
    char = str[i]
    if (!node[char]) return set
    node = node[char]
  }

  return this.traverse(node, str, set)
}

lunr.Trie.prototype.traverse = function (node, prefix, set) {
  Object.keys(node).forEach(function (char) {
    if (char == lunr.Trie.stopSymbol) {
      set.add(prefix)
    } else {
      this.traverse(node[char], prefix + char, set)
    }
  }, this)

  return set
}
