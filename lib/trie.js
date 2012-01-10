Lunr.Trie = (function () {

  var Node = function () {
    this.children = {}
    this.values = []
  }

  Node.prototype = {
    childForKey: function (key) {

      var child = this.children[key]

      if (!child) {
        child = new Node ()
        this.children[key] = child
      };

      return child
    }
  }

  var Trie = function () {
    this.root = new Node ()
  }

  Trie.prototype = {
    get: function (key) {
      var keys = this.keys(key)
      var self = this

      return keys.reduce(function (res, k) {
        self.getNode(k).values.forEach(function (v) {
          var val = Lunr.utils.copy(v)
          if (key === k) val.exact = true
          res.push(val)
        })
        return res
      }, [])
    },

    getNode: function (key) {
      var recursiveGet = function (node, key) {
        if (!key.length) return node
        return recursiveGet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveGet(this.root, key)
    },

    keys: function (term) {
      var keys = [],
          term = term || ""

      var getKeys = function (node, term) {
        if (node.values.length) keys.push(term)

        Object.keys(node.children).forEach(function (childKey) {
          getKeys(node.children[childKey], term + childKey)
        })
      }

      getKeys(this.getNode(term), term)
      return keys
    },

    set: function (key, value) {
      var recursiveSet = function (node, key) {
        if (!key.length) return node.values.push(value)
        recursiveSet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveSet(this.root, key)
    }
  }

  return Trie
})();
