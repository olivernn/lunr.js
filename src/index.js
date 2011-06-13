Search.Index = function (name) {
  this.name = name
  this.fields = {} // by default no fields will be indexed
  this.wordStore = new Search.Store (name + "-words")
  this.docStore = new Search.Store (name + "-docs")

  this.adding = false

  // do this elsewhere???
  this.wordStore.init(function () { console.log('wordStore initialized') })
  this.docStore.init(function () { console.log('docStore initialized') })
}

Search.Index.prototype = {

  add: function (obj) {
    var self = this
    var doc = new Search.Document(obj, this.fields)
    var stopAdding = function () { self.adding = false }

    if (this.adding) {
      setTimeout(function () { self.add(obj) }, 50)
    } else {
      this.adding = true
      doc.words().forEach(function (word) {
        self.wordStore.find(word.id).then(function (existingWord) {
          if (existingWord) {
            existingWord.docs.push(word.docs[0])
            self.wordStore.save(existingWord).then(stopAdding)
          } else {
            self.wordStore.save(word).then(stopAdding)
          };
        })
      })

      this.docStore.save(doc.asJSON())
    };

  },

  empty: function () {
    var self = this

    return new Search.Deferred ([
      self.wordStore.destroyAll(),
      self.docStore.destroyAll()
    ])
  },

  field: function (name, opts) {
    this.fields[name] = opts || {multiplier: 1}
  },

  search: function (term) {
    var self = this
    var returnDeferred = new Search.Deferred ()

    // convert the term into search words
    var words = term
      .split(' ')
      .map(function (str) {
        var word = new Search.Word(str)
        if (!word.isStopWord()) return word.toString()
      })
      .filter(function (wordString) {
        return wordString 
      })

    var wordDeferred = new Search.Deferred (words.map(function (word) { return self.wordStore.find(word) }))

    wordDeferred.then(function (words) {
      if (!words[0]) {
        returnDeferred.resolve([])
      } else {
        var wordDocs = words
          .map(function (word) { 
            return word.docs 
          })
          .sort(function (a, b) {
            if (a.score < b.score) return 1
            if (a.score > b.score) return -1
            return 0
          })

        var docIds = Search.utils.intersect.apply(Search.utils, wordDocs.map(function (docs) {
          return docs.map(function (doc) {
            return doc.documentId 
          })
        }))

        var docDeferred = new Search.Deferred (docIds.map(function (docId) { return self.docStore.find(docId) }))

        docDeferred.then(function (searchDocs) {
          returnDeferred.resolve(searchDocs.map(function (searchDoc) {
            return searchDoc.original
          }))
        })
      }
    })

    return returnDeferred

  }
}