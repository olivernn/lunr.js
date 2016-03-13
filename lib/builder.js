lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = {}
  this.documentTermFrequencies = {}
  this.fieldLengths = { "ALL": {} }
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.documentCount = 0
  this.b = 0.75
  this.k1 = 2
}

lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

lunr.Builder.prototype.field = function (field) {
  this._fields.push(field)
  this.fieldLengths[field] = {}
}

lunr.Builder.prototype.add = function (doc) {
  var docRef = doc[this._ref],
      documentTerms = { "ALL": {} },
      fieldLengths = { "ALL": 0 }

  this.documentCount += 1
  this.documentTermFrequencies[docRef] = documentTerms
  this.fieldLengths[docRef] = fieldLengths

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i],
        field = doc[fieldName],
        tokens = this.tokenizer(field),
        terms = this.pipeline.run(tokens),
        termFrequencies = {}

    // store the length of this field in this document
    fieldLengths[fieldName] = terms.length

    // add the length of this field to the ALL field for this document
    fieldLengths["ALL"] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (termFrequencies[term] == undefined) {
        termFrequencies[term] = 0
      }

      termFrequencies[term] += 1
    }

    // store term frequencies for this field and document
    documentTerms[fieldName] = termFrequencies

    // combine term frequencies for this field into the ALL field
    for (var term in termFrequencies) {
      if (documentTerms["ALL"][term] == undefined) {
        documentTerms["ALL"][term] = 0
      }

      documentTerms["ALL"][term] += termFrequencies[term]
    }
  }
}

lunr.Builder.prototype.createInvertedIndex = function () {
  var termIndex = 0

  for (var docRef in this.documentTermFrequencies) {
    var documentTerms = this.documentTermFrequencies[docRef]

    for (var fieldName in documentTerms) {
      var fieldTerms = documentTerms[fieldName]

      for (var term in fieldTerms) {

        // create an initial posting if one doesn't exist
        // TODO: perhaps create a constructor that does this?
        if (this.invertedIndex[term] == undefined) {
          var posting = { "index": termIndex, "ALL": {} }
          termIndex += 1

          for (var i = 0; i < this._fields.length; i++) {
            posting[this._fields[i]] = {}
          }

          this.invertedIndex[term] = posting
        }

        // need to put any metadata for this term in this field in this document here
        this.invertedIndex[term][fieldName][docRef] = {}
      }
    }
  }
}

lunr.Builder.prototype.calculateIDF = function () {
  for (var term in this.invertedIndex) {
    var termFields = this.invertedIndex[term]

    for (var fieldName in termFields) {
      var field = termFields[fieldName],
          idf = this.idf(term, fieldName)

      field["idf"] = idf
    }
  }
}

lunr.Builder.prototype.calculateAverageFieldLengths = function () {
  var totalFieldLengths = { "ALL": 0 },
      averageFieldLengths = {},
      numberOfDocuments = 0

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i]
    totalFieldLengths[fieldName] = 0
  }

  for (var docRef in this.fieldLengths) {
    var docFieldLengths = this.fieldLengths[docRef]
    numberOfDocuments += 1

    for (var fieldName in docFieldLengths) {
      var docFieldLength = docFieldLengths[fieldName]

      totalFieldLengths[fieldName] += docFieldLength
    }
  }

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i]
    averageFieldLengths[fieldName] = totalFieldLengths[fieldName] / numberOfDocuments
  }

  averageFieldLengths["ALL"] = totalFieldLengths["ALL"] / numberOfDocuments

  this.averageFieldLengths = averageFieldLengths
}

lunr.Builder.prototype.createDocumentVectors = function () {
  var documentVectors = {}

  for (var docRef in this.documentTermFrequencies) {
    var termFrequencies = this.documentTermFrequencies[docRef]

    documentVectors[docRef] = {}

    for (var fieldName in termFrequencies) {
      var fieldTermFrequencies = termFrequencies[fieldName],
          fieldLength = this.fieldLengths[docRef][fieldName],
          averageFieldLength = this.averageFieldLengths[fieldName],
          docFieldVector = new lunr.Vector

      // calculate the score for this term in this field in this document
      for (var term in fieldTermFrequencies) {
        var termFrequency = fieldTermFrequencies[term],
            termIndex = this.invertedIndex[term].index

        var weight = termFrequency / ((( 1 - this.b) + this.b) * (fieldLength / averageFieldLength)),
            score = this.idf(term, fieldName) * weight / this.k1 + weight

        docFieldVector.insert(termIndex, score)
      }

      documentVectors[docRef][fieldName] = docFieldVector
    }
  }

  this.documentVectors = documentVectors
}

lunr.Builder.prototype.createFSA = function () {
  var builder = Object.keys(this.invertedIndex)
    .sort()
    .reduce(function (builder, term) {
      builder.insert(term)
      return builder
    }, new lunr.FSABuilder)

  builder.finish()

  this.fsa = builder.root
}

lunr.Builder.prototype.build = function () {
 this.createInvertedIndex()
 this.calculateIDF()
 this.calculateAverageFieldLengths()
 this.createDocumentVectors()
 this.createFSA()

 return new lunr.Index({
   invertedIndex: this.invertedIndex,
   documentVectors: this.documentVectors,
   fsa: this.fsa,
   averageFieldLengths: this.averageFieldLengths,
   b: this.b,
   k1: this.k1
 })
}

lunr.Builder.prototype.idf = function (term, field) {
  // need to guard against term not being present
  var field = field || "ALL",
      documentsWithTerm = Object.keys(this.invertedIndex[term][field]).length

  return (this.documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)
}

lunr.Builder.prototype.search = function (query) {
  var self = this,
      tokens = this.tokenizer(query),
      terms = this.pipeline.run(tokens)

  // build the query vector
  var queryVector = terms.reduce(function (vector, term) {
    var weight = 1 / (((1 - self.b) + self.b) * (terms.length / self.averageFieldLengths["ALL"])),
        idf = self.idf(term),
        score = idf * weight / self.k1 + weight,
        index = self.invertedIndex[term].index

    vector.insert(index, score)
    return vector
  }, new lunr.Vector)

  var documentVectors = terms.reduce(function (memo, term, i) {
    var index = self.invertedIndex[term].index,
        postings = self.invertedIndex[term]["ALL"]

    Object.keys(postings).forEach(function (docRef) {
      if (docRef in memo) return

      var posting = postings[docRef],
          documentTerms = self.documentTerms[docRef],
          documentVector = new lunr.Vector

      documentTerms.forEach(function (term) {
        var documentTerm = self.invertedIndex[term]["ALL"][docRef]

        documentVector.insert(index, documentTerm.score)
      })

      memo[docRef] = documentVector
    })

    return memo
  }, {})

  return Object.keys(documentVectors)
    .map(function (ref) {
      return { ref: ref, score: queryVector.similarity(documentVectors[ref]) }
    })
    .sort(function (a, b) {
      return b.score - a.score
    })
}
