lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = {}
  this.documentTermFrequencies = {}
  this.documentLengths = {}
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.documentCount = 0
  this.b = 0.75
  this.k1 = 2
  this.termIndex = 0
  this.metadataWhitelist = []
}

lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

lunr.Builder.prototype.field = function (field) {
  this._fields.push(field)
}

lunr.Builder.prototype.add = function (doc) {
  var docRef = doc[this._ref],
      documentTerms = {}

  this.documentCount += 1
  this.documentTermFrequencies[docRef] = documentTerms
  this.documentLengths[docRef] = 0

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i],
        field = doc[fieldName],
        tokens = this.tokenizer(field),
        terms = this.pipeline.run(tokens)

    // store the length of this field for this document
    this.documentLengths[docRef] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (documentTerms[term] == undefined) {
        documentTerms[term] = 0
      }

      documentTerms[term] += 1

      // add to inverted index
      // create an initial posting if one doesn't exist
      if (this.invertedIndex[term] == undefined) {
        var posting = { "index": this.termIndex }
        this.termIndex += 1

        for (var k = 0; k < this._fields.length; k++) {
          posting[this._fields[k]] = {}
        }

        this.invertedIndex[term] = posting
      }

      // add an entry for this term/fieldName/docRef to the invertedIndex
      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
        this.invertedIndex[term][fieldName][docRef] = {}
      }

      // store all whitelisted metadata about this token in the
      // inverted index
      for (var l = 0; l < this.metadataWhitelist.length; l++) {
        var metadataKey = this.metadataWhitelist[l],
            metadata = term.metadata[metadataKey]

        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
          this.invertedIndex[term][fieldName][docRef][metadataKey] = []
        }

        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)
      }
    }

  }
}

lunr.Builder.prototype.calculateIDF = function () {
  var terms = Object.keys(this.invertedIndex),
      termsLength = terms.length

  for (var i = 0; i < termsLength; i++) {
    var term = terms[i],
        termFields = this.invertedIndex[term]

    for (var fieldName in termFields) {
      var field = termFields[fieldName],
          idf = this.idf(term, fieldName)

      field["idf"] = idf
    }
  }
}

lunr.Builder.prototype.calculateAverageDocumentLengths = function () {

  var documentRefs = Object.keys(this.documentLengths),
      numberOfDocuments = documentRefs.length,
      allDocumentsLength = 0

  for (var i = 0; i < numberOfDocuments; i++) {
    var documentRef = documentRefs[i]
    allDocumentsLength += this.documentLengths[documentRef]
  }

  this.averageDocumentLength = allDocumentsLength / numberOfDocuments
}

// TODO: we probably don't need a document vector by field, only all
lunr.Builder.prototype.createDocumentVectors = function () {
  var documentVectors = {},
      docRefs = Object.keys(this.documentTermFrequencies),
      docRefsLength = docRefs.length

  for (var i = 0; i < docRefsLength; i++) {
    var docRef = docRefs[i],
        documentLength = this.documentLengths[docRef],
        documentVector = new lunr.Vector,
        termFrequencies = this.documentTermFrequencies[docRef],
        terms = Object.keys(termFrequencies),
        termsLength = terms.length

    for (var j = 0; j < termsLength; j++) {
      var term = terms[j],
          termFrequency = termFrequencies[term],
          termIndex = this.invertedIndex[term].index

      var weight = termFrequency / (((1 - this.b) + this.b) * (documentLength / this.averageDocumentLength)),
          score = this.idf(term) * weight / this.k1 + weight

      documentVector.insert(termIndex, score)
    }

    documentVectors[docRef] = documentVector
  }

  this.documentVectors = documentVectors
}

lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

lunr.Builder.prototype.build = function () {
  this.calculateIDF()
  this.calculateAverageDocumentLengths()
  this.createDocumentVectors()
  this.createTokenSet()

  return new lunr.Index({
    invertedIndex: this.invertedIndex,
    documentVectors: this.documentVectors,
    tokenSet: this.tokenSet,
    averageDocumentLength: this.averageDocumentLength,
    documentCount: this.documentCount,
    fields: this._fields,
    b: this.b,
    k1: this.k1
  })
}

lunr.Builder.prototype.idf = function (term) {
  var posting = this.invertedIndex[term],
      documentsWithTerm = 0

  for (var fieldName in posting) {
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  return (this.documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)
}

