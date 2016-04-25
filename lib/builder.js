lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = {}
  this.documentTermFrequencies = {}
  this.fieldLengths = {}
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

lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

lunr.Builder.prototype.build = function () {
 this.calculateIDF()
 this.calculateAverageFieldLengths()
 this.createDocumentVectors()
 this.createTokenSet()

 return new lunr.Index({
   invertedIndex: this.invertedIndex,
   documentVectors: this.documentVectors,
   tokenSet: this.tokenSet,
   averageFieldLengths: this.averageFieldLengths,
   documentCount: this.documentCount,
   b: this.b,
   k1: this.k1
 })
}

lunr.Builder.prototype.idf = function (term, fieldName) {
  var posting = this.invertedIndex[term],
      documentsWithTerm = 0

  // sum all the fields if passed fieldName is undefined or ALL
  if (fieldName == undefined || fieldName == "ALL") {

    // Avoiding shadowing the non-local scope variable 'fieldName'
    // which would prevent V8 from optimising this function.
    for (var _fieldName in posting) {
      documentsWithTerm += Object.keys(posting[_fieldName]).length
    }
  } else {
    documentsWithTerm = Object.keys(posting[fieldName]).length
  }

  return (this.documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)
}

