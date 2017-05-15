lunr.FieldRef = function (docRef, fieldName) {
  this.docRef = docRef
  this.fieldName = fieldName
  this._stringValue = fieldName + lunr.FieldRef.joiner + docRef
}

lunr.FieldRef.joiner = "/"

lunr.FieldRef.fromString = function (s) {
  var n = s.indexOf(lunr.FieldRef.joiner)

  if (n === -1) {
    throw "malformed field ref string"
  }

  var fieldRef = s.slice(0, n),
      docRef = s.slice(n + 1)

  return new lunr.FieldRef (docRef, fieldRef)
}

lunr.FieldRef.prototype.toString = function () {
  return this._stringValue
}
