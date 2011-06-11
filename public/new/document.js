Search.Document = function (original, fields) {
  this.original = original
  this.fields = fields
  this.ref = Date.now()
}

Search.Document.prototype = {

  asJSON: function () {
    return {
      id: this.ref,
      words: this.words().map(function (word) { return word.id }),
      original: this.original
    }
  },

  words: function () {
    var words = {}
    var self = this
    var allWords = {}

    Object.keys(this.fields).forEach(function (fieldName) {
      words[fieldName] = self.original[fieldName].split(" ")
        // convert each raw word into a search word
        .map(function (rawWord) {
          var word = new Search.Word(rawWord)
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