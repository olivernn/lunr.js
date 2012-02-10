/*!
 * Lunr - Index
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Lunr.Index provides the public api for the Lunr library.
 *
 * @constructor
 * @param {String} name - the name of this search index.
 *
 */
Lunr.Index = function (name) {
  this.name = name
  this.refName = "id"
  this.fields = {} // by default no fields will be indexed
  this.trie = new Lunr.Trie ()
}

Lunr.Index.prototype = {
  /**
   * ## Lunr.Index.prototype.add
   * This method is the primary way of adding objects to the search index.  It will convert the passed
   * JSON object and convert it into a Lunr.Document.  The words from the document will then be extracted
   * add added to the index.
   *
   * @see Lunr.Document
   *
   * @params {Object} obj - the object to add to the index.
   */
  add: function (obj) {
    var doc = new Lunr.Document(obj, this.refName, this.fields)
    var words = doc.words()

    for (var i=0; i < words.length; i++) {
      var word = words[i]
      this.trie.set(word.id, word.doc)
    };
  },

  /**
   * ## Lunr.Index.prototype.field
   * A method that is part of the DSL for setting up an index.  Use this method to describe which fields
   * from a document should be part of the index.  An options object can be passed as the second argument
   * that will change the way that a particular field is indexed.
   *
   * Currently the supported options are:
   * * __multiplier__ - a multiplier to apply to a field, you can use this to make sure certain fields are
   * considered more important, e.g. a documents title.
   *
   * @params {String} name - the name of the field to index in a document
   * @params {Object} opts - options for indexing this particular field
   *
   * ### Example
   *     this.field('title', { multiplier: 10 })
   *     this.field('body')
   *
   */
  field: function (name, opts) {
    this.fields[name] = opts || {multiplier: 1}
  },

  /**
   * ## Lunr.Index.prototype.ref
   * A method that is part of the DSL for setting up an index.  Use this method to select the property by which objects
   * added to the index can be uniquely identified.
   *
   * @params {String} name - the name of the field to index in a document
   *
   * ### Example
   *     this.ref('cid')
   *
   */
  ref: function (name) {
    this.refName = name
  },

  /**
   * ## Lunr.Index.prototype.search
   * This method is the main interface for searching documents in the index.  You can pass in a string of words
   * separated by spaces.  By default the search is an AND search, so if you searched for 'foo bar' the results
   * would be those documents in the index that contain both the word foo AND the word bar.
   *
   * @params {String} term - the term or terms to search the index for.
   * @returns {Array} an array of references to documents in the index, this will be the property as defined by ref.
   */
  search: function (term) {
    if (!term) return []

    var docIds = Lunr.utils.map(Lunr.Word.fromString(term), function (word) {
      var docs = this.trie
        .get(word.toString())
        .sort(function (a, b) {
          if (a.exact && b.exact === undefined) return -1
          if (b.exact && a.exact === undefined) return 1
          if (a.score < b.score) return 1
          if (a.score > b.score) return -1
          return 0
        })

      return Lunr.utils.map(docs, function (doc) { return doc.documentId })
    }, this)

    return Lunr.utils.intersect.apply(Lunr.utils, docIds)
  },

  /**
   * ## Lunr.Index.prototype.empty
   *
   * This method empties the index, it will delete the index store and create a new, empty one in its place.
   */
  empty: function () {
    delete this.trie
    this.trie = new Lunr.Trie
  }
};
