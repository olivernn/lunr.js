/*!
 * Lunr - Document
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Lunr.Document wraps any document that is added to the index.  It extracts any words from the document
 * fields that need indexing and formats the document in a way ready for insertion into the Lunr.Index
 * docStore.
 *
 * @constructor
 * @param {Object} original - the document to be added to the search index.
 * @param {Object} fields - the fields object from the index, indicationg which fields from the document need indexing.
 *
 */
Lunr.Document = function (original, refName, fields) {
  this.original = original
  this.fields = fields
  this.ref = original[refName]
}

Lunr.Document.prototype = {
  /**
   * ## Lunr.Document.prototype.asJSON
   * Converts this instance of Lunr.Document into a plain object ready for insertion into the Index's docStore.
   * The returned object consists of three properties, an auto generated id, an array of Lunr.Word ids and the
   * original document.
   *
   * @returns {Object} the plain object representation of the Lunr.Document.
   */
  asJSON: function () {
    return {
      id: this.ref,
      words: this.words().map(function (word) { return word.id }),
      original: this.original
    }
  },

  /**
   * ## Lunr.Document.prototype.words
   * For each field in the original document that requires indexing this method will create an instance of
   * Lunr.Word and then tally the total score for that word in the document as a whole.  At this time any
   * multiplier specified in the fields object will be applied.
   *
   * The list of words will then be converted into a format ready for insertion into the index's wordStore.
   *
   * @see {Lunr.Word}
   * @returns {Array} an array of all word objects ready for insertion into the index's wordStore.
   */
  words: function () {
    var words = {}
    var self = this
    var allWords = {}

    var stringToWords = function (str) {
      var splitStr = str.split(/\b/g),
          splitStrLen = splitStr.length,
          out = []

      for (var i=0; i < splitStrLen; i++) {
        var word = new Lunr.Word (splitStr[i])
        if (!word.isStopWord()) out.push(word)
      };

      return out
    }

    Lunr.utils.forEachKey(this.fields, function (fieldName) {
      var wordObjs = stringToWords(self.original[fieldName]),
          numberOfWords = wordObjs.length

      for (var i=0; i < numberOfWords; i++) {
        var word = wordObjs[i].toString()

        if (!(word in allWords)) {
          allWords[word] = { score: 0, ref: self.ref }
        };

        allWords[word].score = allWords[word].score + self.fields[fieldName].multiplier
      };
    })

    return Lunr.utils.mapKeys(allWords, function (word) {
      return {id: word, doc: {score: allWords[word].score, documentId: self.ref} }
    })
  }
};
