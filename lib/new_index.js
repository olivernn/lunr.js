lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.documentVectors = attrs.documentVectors
  this.fsa = attrs.fsa
  this.averageFieldLengths = attrs.averageFieldLengths
  this.b = attrs.b
  this.k1 = attrs.k1
}

lunr.Index.prototype.search = function (query) {
  // pass the query through a pipeline
  // find all the matching terms from the fsa
  // build a query vector
  // grab all relevant document vectors
  // score and sort

  // TODO: set up index tokenizer/pipeline

  var fieldName = "ALL" // just searching all fields at the moment

  var queryFSA = lunr.FSA.fromString(query),
      queryTerms = this.fsa.intersect(queryFSA).toArray(),
      queryVector = new lunr.Vector,
      matchingDocumentRefs = {}

  for (var i = 0; i < queryTerms.length; i++) {
    var term = queryTerms[i],
        termIdf = this.invertedIndex[term][fieldName].idf,
        weight = 1 / ((( 1 - this.b) + this.b) * (queryTerms.length / this.averageFieldLengths[fieldName])),
        score = termIdf * weight / this.k1 + weight,
        termIndex = this.invertedIndex[term].index

    queryVector.insert(termIndex, score)

    for (var docRef in this.invertedIndex[term][fieldName]) {
      if (docRef == "idf") continue
      matchingDocumentRefs[docRef] = true
    }
  }

  return Object.keys(matchingDocumentRefs)
    .map(function (ref) {
      return { ref: ref, score: queryVector.similarity(this.documentVectors[ref][fieldName]) }
    }, this)
    .sort(function (a, b) {
      return b.score - a.score
    })
}
