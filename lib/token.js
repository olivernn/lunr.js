lunr.Token = function (str, metadata) {
  this.str = str || ""
  this.metadata = metadata || {}
}

lunr.Token.prototype.toString = function () {
  return this.str
}

lunr.Token.prototype.update = function (fn) {
  this.str = fn(this.str, this.metadata)
  return this
}

lunr.Token.prototype.clone = function (fn) {
  fn = fn || function (s) { return s }
  return new lunr.Token (fn(this.str), this.metadata)
}
