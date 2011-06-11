Search.Index = function (name) {
  this.name = name
  this.fields = {} // by default no fields will be indexed
  this.wordStore = new Search.Store (name + "-words")
  this.docStore = new Search.Store (name + "-docs")

  // do this elsewhere???
  this.wordStore.init(function () { console.log('wordStore initialized') })
  this.docStore.init(function () { console.log('docStore initialized') })
}

Search.Index.prototype = {

  add: function (obj) {
    var self = this
    var doc = new Search.Document(obj, this.fields)

    doc.words().forEach(function (word) {
      self.wordStore.find(word.id).then(function (existing) {
        if (existing) {
          existing.docs.push(word.docs[0])
          self.wordStore.save(existing).then(function () {
            console.log('update existing word')
          })
        } else {
          self.wordStore.save(word).then(function () {
            console.log('created new word')
          })
        };
      })
    })

    this.docStore.save(doc.asJSON()).then(function () {
      console.log('saved doc')
    })
  },

  field: function (name, opts) {
    this.fields[name] = opts || {multiplier: 1}
  },

  search: function (term) {
    var self = this
    var returnDeferred = new Search.Deferred ()

    // convert the term into search words
    var words = term.split(' ').map(function (str) {
      var word = new Search.Word(str)
      if (!word.isStopWord()) return word.toString()
    }).filter(function (wordString) { return wordString })

    var deferred = new Search.Deferred (words.map(function (word) { return self.wordStore.find(word) }))

    deferred.then(function (words) {
      var docs = words.filter(function (a) { return a }).map(function (word) { return word.docs })[0] // need to get rid of any empty docs cos of crap data
      new Search.Deferred(docs.map(function (doc) {
        return self.docStore.find(doc.documentId || 1)
      })).then(function () {
        returnDeferred.resolve(this)
      })
    })

    return returnDeferred

  }
}