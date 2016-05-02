lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

lunr.Query.prototype.term = function (term, options) {
  var clause = options || {
    "fields": this.allFields
  }

  clause.term = term
  this.clauses.push(clause)

  return this
}
