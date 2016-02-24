lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = {}
  this.fieldLengths = { "ALL": {} }
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.b = 0.75
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

  // initialize the fieldLengths counter for ALL
  this.fieldLengths["ALL"][docRef] = 0

  for (var i = 0; i < this._fields.length; i++) {
    var field = this._fields[i]

    var tokens = this.tokenizer(doc[field]),
        terms = this.pipeline.run(tokens)

    // store the field length for this document
    // required when calculating the right BM25F weights
    this.fieldLengths[field][docRef] = terms.length
    this.fieldLengths["ALL"][docRef] += terms.length

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

lunr.Builder.prototype.finaliseAllTermWeights = function () {
  var self = this

  // calculate the average field lengths for each field including
  // ALL fields
  var averageFieldLengths = this._fields.concat("ALL").reduce(function (memo, field) {
    var fieldLengths = self.fieldLengths[field]
    var fieldTotal = Object.keys(fieldLengths).reduce(function (memo, docRef) {
      return memo + fieldLengths[docRef]
    }, 0)

    memo[field] = fieldTotal / Object.keys(fieldLengths).length
    return memo
  }, {})

  // apply a weight to each token in each field in each document
  Object.keys(this.invertedIndex).forEach(function (term) {
    Object.keys(averageFieldLengths).forEach(function (field) {
      var averageFieldLength = averageFieldLengths[field]

      self.invertedIndex[term][field].forEach(function (posting) {
        var fieldLength = self.fieldLengths[field][posting.ref],
            weight = posting.tf / (((1 - self.b) + self.b) * (fieldLength / averageFieldLength))

        posting.weight = weight
      })
    })
  })
}

lunr.Builder.prototype.build = function () {
}
