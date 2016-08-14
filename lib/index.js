lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.documentVectors = attrs.documentVectors
  this.tokenSet = attrs.tokenSet
  this.documentCount = attrs.documentCount
  this.averageDocumentLength = attrs.averageDocumentLength
  this.b = attrs.b
  this.k1 = attrs.k1
  this.fields = attrs.fields
}

lunr.Index.prototype.search = function (queryString) {
  return this.query(function (query) {
    var parser = new lunr.QueryParser(queryString, query)
    parser.parse()
  })
}

lunr.Index.prototype.query = function (fn) {
  // for each query clause
    // process terms
    // expand terms from token set
    // find matching documents and metadata
    // get document vectors
    // score documents

  var query = new lunr.Query(this.fields),
      matchingDocuments = {},
      queryVector = new lunr.Vector

  fn.call(query, query)

  // TODO: need to potentially pass the token through the pipeline
  for (var i = 0; i < query.clauses.length; i++) {
    var clause = query.clauses[i],
        termTokenSet = lunr.TokenSet.fromClause(clause),
        expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

    for (var j = 0; j < expandedTerms.length; j++) {
      var expandedTerm = expandedTerms[j],
          posting = this.invertedIndex[expandedTerm],
          termIdf = this.idf(expandedTerm),
          weight = 1 / (((1 - this.b) + this.b) * (query.clauses.length / this.averageDocumentLength)),
          score = termIdf * weight / this.k1 + weight,
          termIndex = posting.index

      queryVector.insert(termIndex, score * clause.boost)

      for (var k = 0; k < clause.fields.length; k++) {
        var field = clause.fields[k],
            fieldPosting = posting[field],
            matchingDocumentRefs = Object.keys(fieldPosting)

        for (var l = 0; l < matchingDocumentRefs.length; l++) {
          var matchingDocumentRef = matchingDocumentRefs[l],
              documentMetadata, matchData

          if (matchingDocumentRef == "idf") {
            continue
          }

          documentMetadata = fieldPosting[matchingDocumentRef]
          matchData = new lunr.MatchData (expandedTerm, field, documentMetadata)

          if (matchingDocumentRef in matchingDocuments) {
            matchingDocuments[matchingDocumentRef].combine(matchData)
          } else {
            matchingDocuments[matchingDocumentRef] = matchData
          }

        }
      }
    }
  }

  var matchingDocumentRefs = Object.keys(matchingDocuments),
      results = []

  for (var i = 0; i < matchingDocumentRefs.length; i++) {
    var ref = matchingDocumentRefs[i],
        documentVector = this.documentVectors[ref],
        score = queryVector.similarity(documentVector)

    results.push({
      ref: ref,
      score: score,
      matchData: matchingDocuments[ref]
    })
  }

  return results.sort(function (a, b) {
    return b.score - a.score
  })
}

// TODO: this is copied from the builder
// * store the idf for the ALL field right on the posting it self
// this will allow us to get rid of this
lunr.Index.prototype.idf = function (term) {
  var posting = this.invertedIndex[term],
      documentsWithTerm = 0

  for (var fieldName in posting) {
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  return (this.documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)
}

lunr.Index.prototype.toJSON = function () {
  var invertedIndex = Object.keys(this.invertedIndex)
    .sort()
    .map(function (term) {
      return [term, this.invertedIndex[term]]
    }, this)

  var documentVectors = Object.keys(this.documentVectors)
    .map(function (ref) {
      return [ref, this.documentVectors[ref].toJSON()]
    }, this)

  return {
    averageDocumentLength: this.averageDocumentLength,
    b: this.b,
    k1: this.k1,
    fields: this.fields,
    documentVectors: documentVectors,
    invertedIndex: invertedIndex
  }
}

lunr.Index.load = function (serializedIndex) {
  var attrs = {},
      documentVectors = {},
      serializedVectors = serializedIndex.documentVectors,
      documentCount = 0,
      invertedIndex = {},
      serializedInvertedIndex = serializedIndex.invertedIndex,
      tokenSetBuilder = new lunr.TokenSet.Builder

  for (var i = 0; i < serializedVectors.length; i++, documentCount++) {
    var tuple = serializedVectors[i],
        ref = tuple[0],
        elements = tuple[1]

    documentVectors[ref] = new lunr.Vector(elements)
  }

  for (var i = 0; i < serializedInvertedIndex.length; i++) {
    var tuple = serializedInvertedIndex[i],
        term = tuple[0],
        posting = tuple[1]

    tokenSetBuilder.insert(term)
    invertedIndex[term] = posting
  }

  tokenSetBuilder.finish()

  attrs.b = serializedIndex.b
  attrs.k1 = serializedIndex.k1
  attrs.fields = serializedIndex.fields
  attrs.averageDocumentLength = serializedIndex.averageDocumentLength

  attrs.documentCount = documentCount
  attrs.documentVectors = documentVectors
  attrs.invertedIndex = invertedIndex
  attrs.tokenSet = tokenSetBuilder.root

  return new lunr.Index(attrs)
}
