lunr.MatchData = function (term, field, metadata) {
  this.terms = [term]

  this.metadata = {}
  this.metadata[field] = metadata
}

lunr.MatchData.prototype.combine = function (otherMatchData) {
  this.terms = this.terms.concat(otherMatchData.terms)

  var otherMatchDataFields = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < otherMatchDataFields.length; i++) {
    var field = otherMatchDataFields[i],
        fieldMetadata = otherMatchData.metadata[field],
        fieldMetadataKeys = Object.keys(fieldMetadata)

    for (var j = 0; j < fieldMetadataKeys.length; j++) {
      var metadataKey = fieldMetadataKeys[j]
      this.metadata[field][metadataKey] = this.metadata[field][metadataKey].concat(fieldMetadata[metadataKey])
    }
  }
}
