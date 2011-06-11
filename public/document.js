Search.Document = function (original, store) {
  this.original = original
  this.store = store
  this.fields = Object.keys(original)
  this._words = []
  this.id = Date.now()
}

Search.Document.prototype = {

  asJSON: function () {
    return {
      id: this.id,
      words: this.words(),
      original: this.original
    }
  },

  save: function () {
    var self = this
    var d = new Search.Deferred ()
    this.store.save(this.asJSON(), function () {
      d.resolve(self)
    })
    return d
  },

  words: function () {
    var self = this

    this.fields.forEach(function (field) {
      self.original[field].split(' ').forEach(function (str) {
        var word = new Search.Word(str)
        if (word.valid()) {
          if (self._words.indexOf(word) == -1) {
            self._words.push(word)
          };
        };
      })
    })

    return this._words
  }
}