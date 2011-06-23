/*!
 * Searchlite - Document
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Searchlite.Document wraps any document that is added to the index.  It extracts any words from the document
 * fields that need indexing and formats the document in a way ready for insertion into the Searchlite.Index
 * docStore.
 *
 * @constructor
 * @param {Object} original - the document to be added to the search index.
 * @param {Object} fields - the fields object from the index, indicationg which fields from the document need indexing.
 *
 */
Searchlite.Document = function (original, fields) {
  this.original = original
  this.fields = fields
  this.ref = Date.now()
}

Searchlite.Document.prototype = {
  /**
   * ## Searchlite.Document.prototype.asJSON
   * Converts this instance of Searchlite.Document into a plain object ready for insertion into the Index's docStore.
   * The returned object consists of three properties, an auto generated id, an array of Searchlite.Word ids and the
   * original document.
   *
   * @returns {Object} the plain object representation of the Searchlite.Document.
   */
  asJSON: function () {
    return {
      id: this.ref,
      words: this.words().map(function (word) { return word.id }),
      original: this.original
    }
  },

  /**
   * ## Searchlite.Document.prototype.words
   * For each field in the original document that requires indexing this method will create an instance of
   * Searchlite.Word and then tally the total score for that word in the document as a whole.  At this time any
   * multiplier specified in the fields object will be applied.
   *
   * The list of words will then be converted into a format ready for insertion into the index's wordStore.
   *
   * @see {Searchlite.Word}
   * @returns {Array} an array of all word objects ready for insertion into the index's wordStore.
   */
  words: function () {
    var words = {}
    var self = this
    var allWords = {}

    Object.keys(this.fields).forEach(function (fieldName) {
      words[fieldName] = self.original[fieldName].split(/\b/g)
        // filter out any non word words
        .filter(function (rawWord) {
          return !!rawWord.match(/\w/)
        })
        // convert each raw word into a search word
        .map(function (rawWord) {
          var word = new Searchlite.Word(rawWord)
          if (!word.isStopWord()) return word.toString()
        })
        // filter out any stop words
        .filter(function (word) {
          return word
        })
        // create the total score
        .forEach(function (word) {
          if (!allWords[word]) { allWords[word] = {score: 0, ref: self.ref} }
          allWords[word].score = allWords[word].score + self.fields[fieldName].multiplier
        })
    })

    return Object.keys(allWords).map(function (word) {
      return {id: word, docs: [{score: allWords[word].score, documentId: self.ref}] }
    })

  }
}