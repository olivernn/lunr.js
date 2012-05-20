lunr.Document = function (raw) {
  this.id = raw.id
  delete raw.id
  this.raw = raw
}

lunr.Document.prototype.toPostings = function () {

  var id = this.id,
      raw = this.raw

  var tf = function (term, text) {
    var termCount = text.filter(function (t) { return t === term }).length
    return termCount / text.length
  }

  return Object.keys(this.raw).reduce(function (postings, fieldName) {

    var tokens = raw[fieldName]

    tokens.forEach(function (token) {
      if (token in postings) {
        // posting already exists, just add this field
        postings[token].fields[fieldName] = tf(token, tokens)
      } else {
        // posting doesn't exist, add a new one with this field
        var fields = {}
        fields[fieldName] = tf(token, tokens)

        postings[token] = {
          id: id,
          fields: fields
        }
      }
    })

    return postings

  }, {})
}