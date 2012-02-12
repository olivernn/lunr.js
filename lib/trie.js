/*!
 * Lunr - Trie
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Lunr.Trie = (function () {

  /**
   * A node in the trie
   *
   * @constructor
   * @private
   */
  var Node = function () {
    this.children = {}
    this.values = []
  }
  
  /**
   * Returns the correct child node for the given key.
   *
   * @private
   * @params {String} key - the key for the child
   * @returns {Node} the node for the given key.
   */
  Node.prototype.childForKey = function (key) {

    var child = this.children[key]

    if (!child) {
      child = new Node ()
      this.children[key] = child
    };

    return child
  }

  /**
   * Lunr.Trie stores the built search index.  It handles lookups against the index and the building of the index.
   *
   * @constructor
   */
  var Trie = function () {
    this.root = new Node ()
  }

  /**
   * Gets objects from the trie which match the passed key.
   *
   * Takes a key and gets all objects from the trie which could match the key.
   *
   * @param {String} key the key will be used to lookup values
   * @returns {Array} an array of values found in the trie
   */
  Trie.prototype.get = function (key) {
    var keys = this.keys(key)
    var self = this

    return Lunr.utils.reduce(keys, function (res, k) {
      Lunr.utils.forEach(self.getNode(k).values, function (v) {
        var val = Lunr.utils.copy(v)
        if (key === k) val.exact = true
        res.push(val)
      })
      return res
    }, [])
  }

  /**
   * Gets nodes from the trie for the given key.
   *
   * Takes a key and gets the node for that key.
   *
   * @param {String} key the key will be used to lookup values
   * @returns {Node} a node in the trie that matches the key
   */
  Trie.prototype.getNode = function (key) {
    var recursiveGet = function (node, key) {
      if (!key.length) return node
      return recursiveGet(node.childForKey(key.charAt(0)), key.slice(1))
    }

    return recursiveGet(this.root, key)
  }

  /**
   * Gets all keys from the trie that have a given prefix.
   *
   * Takes the given prefix and walks the trie, returning all keys which contain the prefix.
   *
   * @param {String} term the prefix to search with
   * @returns {Array} a list of keys that match the prefix
   */
  Trie.prototype.keys = function (term) {
    var keys = [],
        term = term || ""

    var getKeys = function (node, term) {
      if (node.values.length) keys.push(term)

      Lunr.utils.forEachKey(node.children, function (childKey) {
        getKeys(node.children[childKey], term + childKey)
      })
    }

    getKeys(this.getNode(term), term)
    return keys
  }

  /**
   * Set a key to the passed value.
   *
   * Takes a key and a value, walks through the trie to the right node and adds the
   * given value to that node.
   *
   * @param {String} key the key under which the value should be stored
   * @param {Object} value the value to store
   */
  Trie.prototype.set = function (key, value) {
    var recursiveSet = function (node, key) {
      if (!key.length) return node.values.push(value)
      recursiveSet(node.childForKey(key.charAt(0)), key.slice(1))
    }

    return recursiveSet(this.root, key)
  }

  return Trie
})();
