lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = {}
  this.fieldLengths = { "ALL": {} }
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
}

lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

lunr.Builder.prototype.field = function (field) {
  this._fields.push(field)
  this.fieldLengths[field] = {}
}

lunr.Builder.prototype.add = function (doc) {
  var docTotals = {},
      docRef = doc[this._ref]

  for (var i = 0; i < this._fields.length; i++) {
    var field = this._fields[i]

    var tokens = this.tokenizer(doc[field]),
        terms = this.pipeline.run(tokens)

    // store the field length for this document
    // required when calculating the right BM25F weights
    this.fieldLengths[field][docRef] = terms.length

    var fieldPostings = terms.reduce(function (memo, term) {
      // create an empty posting if we've not seen this term before
      if (!memo[term]) memo[term] = { ref: docRef, tf: 0 }
      if (!docTotals[term]) docTotals[term] = 0

      memo[term]["tf"] += 1

      // add any metadata associated with the term to the posting
// TODO: re-introduce this when lunr.Token is being used
//      Object.keys(term.metadata).forEach(function (metadataKey) {
//        if (!memo[term][metadataKey]) memo[term][metadataKey] = []
//        memo[term][metadataKey].push(term.metadata[metadataKey])
//      })

      docTotals[term] += 1

      return memo
    }, {})

    // merge the postings for this document into the corpus inverted index
    Object.keys(fieldPostings).forEach(function (term) {

      // if we've not seen this term before set up a posting with all known fields
      // and a document wide entry called ALL
      if (!this.invertedIndex[term]) {
        this.invertedIndex[term] = this._fields.reduce(function (obj, f) {
          obj[f] = []
          return obj
        }, { "ALL": [] })
      }

      // add the postings from this field into the inverted index
      this.invertedIndex[term][field].push(fieldPostings[term])
    }, this)
  }

  // finally add postings for the document as a whole, everything
  // we've added so far has been scoped to a field
  Object.keys(docTotals).forEach(function (term) {
    this.invertedIndex[term]["ALL"].push({
      ref: docRef,
      tf: docTotals[term]
    })
  }, this)
}

lunr.Builder.prototype.build = function () {
}
