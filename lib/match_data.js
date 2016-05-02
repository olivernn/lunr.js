lunr.MatchData = function (term, field, metadata) {
  this.terms = [term]

  this.metadata = {}
  this.metadata[field] = metadata
}

lunr.MatchData.prototype.combine = function (otherMatchData) {
  this.terms = this.terms.concat(otherMatchData.terms)

  var otherMatchDataFields = Object.keys(otherMatchData)

  for (var i = 0; i < otherMatchData.fields.length; i++) {
    var field = otherMatchDataFields[i],
        fieldMetadata = otherMatchData.metadata[field],
        fieldMetadataKeys = Object.keys(fieldMetadata)

    for (var j = 0; j < fieldMetadataKeys.length; j++) {
      var metadataKey = fieldMetadataKeys[j]
      this.metadata[field][metadatakey] = this.metadata[field][metadataKey].concat(fieldMetadata[metadataKey])
    }
  }
}
