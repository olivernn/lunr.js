var stopWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that"]


Search.Word = function (string) {
  this.string = string
}

Search.Word.prototype = {

  save: function () {
    // find or create word in words index
  },

  toString: function () {
    // stem and metaphone the string
  },

  valid: function () {
    // check if it is a stop word
  }
}