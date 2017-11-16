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
  // XXX omit tokenizer for now
  return {
    _ref: this._ref,
    _fields: this._fields,
    invertedIndex: this.invertedIndex,
    fieldTermFrequencies: this.fieldTermFrequencies,
    fieldLengths: this.fieldLengths,
    pipeline: this.pipeline.toJSON(),
    searchPipeline: this.searchPipeline.toJSON(),
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

  // builder.tokenizer is initialized to the default by the MutableBuilder
  // constructor
  builder.pipeline = lunr.Pipeline.load(builder.pipeline)
  builder.searchPipeline = lunr.Pipeline.load(builder.searchPipeline)

  return builder
}
