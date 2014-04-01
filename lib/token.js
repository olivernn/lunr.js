lunr.Token = function(args) {
  // The indexed value of the token
  this.indexedAs = args.indexedAs

  // Start position in the document
  this.startPos = args.startPos

  // Name of the field in which this token appears
  this.field = args.field

  // The raw value of the token in the document
  this.raw = args.raw
}

lunr.Token.prototype.toJSON = function() {
  return {
    indexedAs: this.indexedAs,
    startPos: this.startPos,
    field: this.field,
    raw: this.raw
  }
}
