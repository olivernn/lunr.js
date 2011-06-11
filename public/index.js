Search.Index = function (name, fields) {
  this.name = name
  this.fields = fields
  this.documentStore = new Search.Store(this.name + '-doc')
}

Search.Index.prototype = {

  init: function () {
    this.documentStore.init()
  },

  add: function (obj) {
    var self = this
    var doc = new Search.Document(obj, this.documentStore)

    doc.save()

    // doc.words().forEach(function (docWord) {
    //   self.wordsStore.find(word).then(function (word) {
    //     word.add(doc.ref())
    //   })
    // })

    return this
  },

  clear: function () {
    
  },

  search: function (term) {
    
  }
}