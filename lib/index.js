lunr.Index = function () {
  this.store = new lunr.Store
  this.pipeline = new lunr.Pipeline
  this._fields = []
  this._ref = 'id'
  this._docCount = 0
}

lunr.Index.prototype.field = function (fieldName, options) {
  this._fields.push({
    name: fieldName,
    options: options
  })
}

lunr.Index.prototype.ref = function (refName) {
  this._ref = refName
}

lunr.Index.prototype.add = function (rawDoc) {
  // extract keys from raw doc, tokenize and pass through the pipeline
  var preparedDoc = this._fields.reduce(function (memo, field) {
    var rawField = rawDoc[field.name],
        processedField = lunr.tokenizer(rawField)

    memo[field.name] = processedField

    return memo
  }, {id: rawDoc[this._ref]})

  // create a document and generate the postings
  var doc = new lunr.Document(preparedDoc),
      postings = doc.toPostings()

  // add each posting to the store
  Object.keys(postings).forEach(function (term) {
    this.store.set(term, this.store.root, postings[term])
  }, this)

  this._docCount++
}

lunr.Index.prototype.search = function (queryString) {
  // tokenize the queryString
  // get all the docs that contain the query terms
  // covnert the query terms to idf vector
  // multiply the doc vector by idf
  // apply any weightings to the doc
  // sort by similarity

  var queryTokens = lunr.tokenizer(queryString)

  // getting a list of documents which contain the term
  // from the query, this will return an array of arrays.
  var postings = queryTokens.map(function (token) {
    return this.store.get(token, this.store.root)._values
  }, this)

  var queryIdf = queryTokens.map(function (token) {
    return Math.log(this._docCount / 1 + this.store.count(token, this.store.root))
  }, this)

  var queryVector = new lunr.Vector(queryIdf)

  // generating an object with doc ids as keys and an array of tf
  // for each term in the query for the given document.
  var vectors = postings.reduce(function (final, tokenMatches, tokenIdx) {
    tokenMatches.forEach(function (doc) {
      if (!(doc.id in final)) final[doc.id] = []

      var score = Object.keys(doc.fields).reduce(function (total, fieldName) {
        return total + doc.fields[fieldName]
      }, 0)

      final[doc.id][tokenIdx] = score
    })

    return final
  }, {})

  // converting the doc tf into a tf*idf vector ready for
  // comparison with the query idf vector
  Object.keys(vectors).forEach(function(docId) {
    vectors[docId] = vectors[docId].map(function (val, idx) {
      if (!val) return 0
      return val * queryIdf[idx]
    })

    vectors[docId] = new Lunr.Vector (vectors[docId]) 
  })

  // ordering the document ids by how similar the doc vector is to
  // the query vector.
  return Object.keys(vectors).sort(function(a, b) {
    var aSimilarity = a.similarity(queryVector),
        bSimilarity = b.similarity(queryVector)

    if (aSimilarity < bSimilarity) return -1
    if (bSimilarity < aSimilarity) return 1
    return 0
  })

}
