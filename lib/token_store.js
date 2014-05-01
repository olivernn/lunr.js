/*!
 * lunr.stemmer
 * Copyright (C) @YEAR Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.TokenStore is used for efficient storing and lookup of the reverse
 * index of token to document ref.
 *
 * @constructor
 */
lunr.TokenStore = function () {
  this.forwards = new lunr.Trie
  this.backwards = new lunr.Trie
  this.store = {}
  this.length = 0
}

/**
 * Loads a previously serialised token store
 *
 * @param {Object} serialisedData The serialised token store to load.
 * @returns {lunr.TokenStore}
 * @memberOf TokenStore
 */
lunr.TokenStore.load = function (serialisedData) {
  var tokenStore = new this

  tokenStore.store = serialisedData.store
  tokenStore.forwards = lunr.Trie.load(serialisedData.forwards)
  tokenStore.backwards = lunr.Trie.load(serialisedData.backwards)
  tokenStore.length = serialisedData.length

  return tokenStore
}

/**
 * Adds a new token doc pair to the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to store the doc under
 * @param {Object} doc The doc to store against the token
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this lunr.TokenStore
 * is used.
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.add = function (token, doc) {
  this.forwards.add(token.toString())
  this.backwards.add(lunr.utils.reverseString(token.toString()))

  if (!this.store[token]) this.store[token] = {}

  this.store[token][doc.ref] = doc

  this.length += 1
}

/**
 * Checks whether this key is contained within this lunr.TokenStore.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to check for
 * @param {Object} root An optional node at which to start
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.has = function (token) {
  return !!this.store[token]
}

/**
 * Retrieve the documents for a node for the given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.get = function (token, root) {
  return this.store[token] || {}
}

lunr.TokenStore.prototype.count = function (token) {
  return Object.keys(this.get(token)).length
}

/**
 * Remove the document identified by ref from the token in the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.remove = function (token, ref) {
  if (!token) return
  if (!this.store[token]) return

  delete this.store[token][ref]
}

/**
 * Find all the possible suffixes of the passed token using tokens
 * currently in the store.
 *
 * @param {String} token The token to expand.
 * @returns {Array}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.expand = function (token) {
  if (!token.containsWildcard()) return [token]

  var suffix = token.suffix(),
      prefix = token.prefix()

  if (suffix && prefix) {
    var forwardSet = this.forwards.suffixes(prefix)

    var backwardSet = this.backwards.suffixes(lunr.utils.reverseString(suffix))
      .map(lunr.utils.reverseString)
      .reduce(function (set, token) {
        set.add(token)
        return set
      }, new lunr.SortedSet)

    return forwardSet.intersect(backwardSet).map(function (t) { return new lunr.Token (t) })

  } else if (suffix) {
    return this.backwards.suffixes(lunr.utils.reverseString(suffix))
      .map(lunr.utils.reverseString)
      .map(function (t) { return new lunr.Token (t) })

  } else if (prefix) {
    return this.forwards.suffixes(prefix).map(function (t) { return new lunr.Token (t) })
  }
}

/**
 * Returns a representation of the token store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.toJSON = function () {
  return {
    store: this.store,
    forwards: this.forwards.toJSON(),
    backwards: this.backwards.toJSON(),
    length: this.length
  }
}

