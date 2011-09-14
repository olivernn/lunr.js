Lunr.Trie = (function () {
  var Node = function (key) {
    this.children = []
    this.key = key
    this.value = []
  }

  Node.prototype = {
    childForKey: function (key) {
      var child = this.children.filter(function (child) { return child.match(key) })[0]

      if (!child) {
        child = new Node (key)
        this.children.push(child)
      };

      return child
    },

    setValue: function (value) {
      this.value.push(value)
    },

    match: function (key) {
      return key === this.key
    }
  }

  var Trie = function () {
    this.root = new Node ()
  }

  Trie.prototype = {
    get: function (key) {
      var recursiveGet = function (node, key) {
        if (!key.length) return node.value
        return recursiveGet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveGet(this.root, key)
    },

    set: function (key, value) {
      var recursiveSet = function (node, key) {
        if (!key.length) return node.setValue(value)
        recursiveSet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveSet(this.root, key)
    }
  }

  return Trie
})()