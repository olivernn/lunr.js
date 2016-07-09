lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

lunr.Query.prototype.clause = function (clause) {
  if (!('fields' in clause)) {
    clause.fields = this.allFields
  }

  this.clauses.push(clause)

  return this
}

lunr.Query.prototype.term = function (term, options) {
  var clause = options || {}
  clause.term = term

  this.clause(clause)

  return this
}
