lunr.MutableBuilder = function () {
  lunr.Builder.call(this)
}

lunr.MutableBuilder.prototype = new lunr.Builder()

lunr.MutableBuilder.prototype.build = function build () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new lunr.MutableIndex({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: this._fields,
    pipeline: this.searchPipeline,
    builder: this
  })
}

lunr.MutableBuilder.prototype.remove = function remove (doc) {
  var docRef = doc[this._ref]

  this.documentCount -= 1

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i],
        fieldRef = new lunr.FieldRef (docRef, fieldName)

    delete this.fieldTermFrequencies[fieldRef]
    delete this.fieldLengths[fieldRef]
  }

  // XXX what if a term disappears from the index?
  for (var term in this.invertedIndex) {
    for (var fieldName in this.invertedIndex[term]) { // XXX what about "_index"?
      delete this.invertedIndex[term][fieldName][docRef]
    }
  }
}

lunr.MutableBuilder.prototype.toJSON = function toJSON () {
  var fieldRefs = []
  var fieldTermFrequencies = []
  var fieldLengths = []

  for (var fieldRef in this.fieldTermFrequencies) {
    if (this.fieldTermFrequencies.hasOwnProperty(fieldRef)) {
      fieldRefs.push(fieldRef)
      fieldTermFrequencies.push(this.fieldTermFrequencies[fieldRef])
      fieldLengths.push(this.fieldLengths[fieldRef])
    }
  }

  // XXX omit tokenizer for now
  // some properties (_fields, invertedIndex, searchPipeline) are omitted
  // from here because they're on the index, and serializing them twice
  // would be redundant
  return {
    _ref: this._ref,
    fieldRefs: fieldRefs,
    fieldTermFrequencies: fieldTermFrequencies,
    fieldLengths: fieldLengths,
    pipeline: this.pipeline.toJSON(),
    documentCount: this.documentCount,
    _b: this._b, // XXX special (due to precision)?
    _k1: this._k1, // XXX special (due to precision)?
    termIndex: this.termIndex,
    metadataWhitelist: this.metadataWhitelist
  }
}

lunr.MutableBuilder.load = function load (serializedBuilder) {
  var builder = new lunr.MutableBuilder()

  for (var k in serializedBuilder) {
    if (serializedBuilder.hasOwnProperty(k)) {
      builder[k] = serializedBuilder[k]
    }
  }

  var fieldRefs = builder.fieldRefs
  var fieldTermFrequencies = builder.fieldTermFrequencies
  var fieldLengths = builder.fieldLengths
  delete builder.fieldRefs

  builder.fieldTermFrequencies = {}
  builder.fieldLengths = {}

  for (var i = 0; i < fieldRefs.length; i++) {
    var fieldRef = fieldRefs[i]
    builder.fieldTermFrequencies[fieldRef] = fieldTermFrequencies[i]
    builder.fieldLengths[fieldRef] = fieldLengths[i]
  }

  // builder.tokenizer is initialized to the default by the MutableBuilder
  // constructor
  builder.pipeline = lunr.Pipeline.load(builder.pipeline)

  return builder
}
