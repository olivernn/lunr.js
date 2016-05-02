lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.documentVectors = attrs.documentVectors
  this.tokenSet = attrs.tokenSet
  this.documentCount = attrs.documentCount
  this.averageFieldLengths = attrs.averageFieldLengths
  this.b = attrs.b
  this.k1 = attrs.k1
}

lunr.Index.prototype.query = function (fn) {
  // for each query clause
    // process terms
    // expand terms from token set
    // find matching documents and metadata
    // get document vectors
    // score documents

  // TODO: the index needs to know about the fields it has
  var query = new lunr.Query(["title", "body"]),
      matchingDocuments = {},
      queryVector = new lunr.Vector

  fn.call(query, query)

  // TODO: need to potentially pass the token through the pipeline
  for (var i = 0; i < query.clauses.length; i++) {
    var clause = query.clauses[i],
        termTokenSet = lunr.TokenSet.fromString(clause.term),
        expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

    for (var j = 0; j < expandedTerms.length; j++) {
      var expandedTerm = expandedTerms[j],
          posting = this.invertedIndex[expandedTerm]
          termIdf = this.idf(expandedTerm),
          weight = 1 / ((( 1 - this.b) + this.b) * (query.clauses.length / this.averageFieldLengths["ALL"])),
          score = termIdf * weight / this.k1 + weight,
          termIndex = posting.index

      queryVector.insert(termIndex, score)

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
          matchData = new lunr.MatchData (clause.term, field, documentMetadata)

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
        documentVector = this.documentVectors[ref]["ALL"],
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

lunr.Index.prototype.search = function (query, fieldName) {
  // pass the query through a pipeline
  // find all the matching terms from the tokenSet
  // build a query vector
  // grab all relevant document vectors
  // score and sort

  // TODO: set up index tokenizer/pipeline

  var fieldName = fieldName || "ALL" // just searching all fields at the moment

  var queryTokenSet = lunr.TokenSet.fromString(query),
      queryTerms = this.tokenSet.intersect(queryTokenSet).toArray(),
      queryVector = new lunr.Vector,
      matchingDocumentRefs = {},
      results = []

  for (var i = 0; i < queryTerms.length; i++) {
    var term = queryTerms[i],
        posting = this.invertedIndex[term],
        termIdf = this.idf(term, fieldName),
        weight = 1 / ((( 1 - this.b) + this.b) * (queryTerms.length / this.averageFieldLengths[fieldName])),
        score = termIdf * weight / this.k1 + weight,
        termIndex = posting.index

    queryVector.insert(termIndex, score)

    if (fieldName == "ALL") {
      for (var field in posting) {
        var fieldPosting = posting[field]

        for (var docRef in fieldPosting) {
          if (docRef == "idf" || docRef in matchingDocumentRefs) continue
          matchingDocumentRefs[docRef] = true
          results.push({
            ref: docRef,
            score: queryVector.similarity(this.documentVectors[docRef][fieldName])
          })
        }
      }

    } else {
      for (var docRef in posting[fieldName]) {
        if (docRef == "idf" || docRef in matchingDocumentRefs) continue
        matchingDocumentRefs[docRef] = true
        results.push({
          ref: docRef,
          score: queryVector.similarity(this.documentVectors[docRef][fieldName])
        })
      }
    }
  }

  return results.sort(function (a, b) {
    return b.score - a.score
  })
}

// TODO: this is copied from the builder
// * store the idf for the ALL field right on the posting it self
// this will allow us to get rid of this
lunr.Index.prototype.idf = function (term, fieldName) {
  var posting = this.invertedIndex[term],
      documentsWithTerm = 0

  // sum all the fields if passed fieldName is undefined or ALL
  if (fieldName == undefined || fieldName == "ALL") {
    for (fieldName in posting) {
      documentsWithTerm += Object.keys(posting[fieldName]).length
    }
  } else {
    documentsWithTerm = Object.keys(posting[fieldName])
  }

  return (this.documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)
}
