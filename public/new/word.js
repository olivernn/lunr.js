Search.Word = function (raw) {
  this.raw = raw
}

Search.Word.stopWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "this"]

Search.Word.prototype = {

  isStopWord: function () {
    return (Search.Word.stopWords.indexOf(this.raw.toLowerCase()) !== -1)
  },

  toString: function () {
    if (this.isStopWord()) return
    return this.raw.porterStemmer().metaphone()
  }
}