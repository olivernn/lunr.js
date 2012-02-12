/*!
 * Lunr - Index
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Lunr.Index = (function () {

  /**
   * Lunr.Index provides the public api for the Lunr library.
   *
   * A Lunr.Index is returned from using the convinience wrapper `Lunr`.  It holds the configuration
   * regarding which fields from a document to index, and the weight to apply to those fields.  It also
   * manages the store for the index.
   *
   * @constructor
   * @param {String} name - the name of this search index.
   *
   */
  var Index = function (name) {
    this.name = name
    this.refName = "id"
    this.fields = {} // by default no fields will be indexed
    this.trie = new Lunr.Trie ()
  }

  /**
   * Adds objects to the search index.
   *
   * It will convert the passed JSON object and convert it into a Lunr.Document.
   * The words from the document will then be extracted and added to the index.
   *
   * @param {Object} obj the object to add to the index.
   * @see Lunr.Document
   */
  Index.prototype.add = function (obj) {
    var doc = new Lunr.Document(obj, this.refName, this.fields)
    var words = doc.words()

    for (var i=0; i < words.length; i++) {
      var word = words[i]
      this.trie.set(word.id, word.doc)
    };
  }

  /**
   * Adds fields to the index.
   *
   * Use this method to describe which fields from a document should be part of the index.
   * An options object can be passed as the second argument that will change the way that
   * a particular field is indexed.
   *
   * `multiplier` is a multiplier to apply to a field, you can use this to make sure certain fields are
   * considered more important, e.g. a documents title.
   *
   * @param {String} name the name of the field to index in a document
   * @param {Object} opts options for indexing this particular field
   *
   * Example:
   *
   *     this.field('title', { multiplier: 10 })
   *     this.field('body')
   *
   */
  Index.prototype.field = function (name, opts) {
    this.fields[name] = opts || {multiplier: 1}
  }

  /**
   * Sets the ref for the index.
   *
   * Use this method to select the property by which objects added to the index can be uniquely identified.
   *
   * @param {String} name the name of the field to index in a document
   *
   * Example:
   *
   *     this.ref('cid')
   *
   */
  Index.prototype.ref = function (name) {
    this.refName = name
  }

  /**
   * Searches the index for a term.
   *
   * You can pass in a string of words separated by spaces.  By default the search is an AND search,
   * so if you searched for 'foo bar' the results would be those documents in the index that contain
   * both the word foo AND the word bar.
   *
   * @param {String} term the term or terms to search the index for.
   * @returns {Array} an array of references to documents in the index, this will be the property as defined by ref.
   */
  Index.prototype.search = function (term) {
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
  }

  /**
   * Empties the index.
   *
   * It will delete the index store and create a new, empty one in its place.
   */
  Index.prototype.empty = function () {
    delete this.trie
    this.trie = new Lunr.Trie
  }

  /*!
   * exposing the constructor
   * @private
   */
  return Index
})()
