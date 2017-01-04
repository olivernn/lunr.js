/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @property {string[]} terms - All the query terms that the document matched.
 * @property {object} metadata - A collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData = function (term, field, metadata) {
  this.terms = [term]

  this.metadata = {}
  this.metadata[field] = metadata
}

/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData.prototype.combine = function (otherMatchData) {
  this.terms = this.terms.concat(otherMatchData.terms)

  var otherMatchDataFields = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < otherMatchDataFields.length; i++) {
    var field = otherMatchDataFields[i],
        fieldMetadata = otherMatchData.metadata[field],
        fieldMetadataKeys = Object.keys(fieldMetadata)

    if (this.metadata[field] == undefined) {
      this.metadata[field] = {}
    }

    for (var j = 0; j < fieldMetadataKeys.length; j++) {
      var metadataKey = fieldMetadataKeys[j]

      if (this.metadata[field][metadataKey] == undefined) {
        this.metadata[field][metadataKey] = fieldMetadata[metadataKey]
      } else {
        this.metadata[field][metadataKey] = this.metadata[field][metadataKey].concat(fieldMetadata[metadataKey])
      }
    }
  }
}
