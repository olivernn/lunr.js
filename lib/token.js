lunr.Token = function (str) {
  this.str = str.toLowerCase()
  this.metadata = new lunr.TokenMetadata
}

lunr.Token.prototype.containsWildcard = function () {
  return this.str.indexOf('*') > -1
}

lunr.Token.prototype.prefix = function () {
  if(!this._parts) this._parts = this.str.split('*')
  return this._parts[0]
}

lunr.Token.prototype.suffix = function () {
  if(!this._parts) this._parts = this.str.split('*')
  return this._parts[1]
}

lunr.Token.prototype.similarity = function (other) {
  var withoutWildcards = this.str.replace('*', ''),
      str = other.toString()

  if (withoutWildcards == str) return 1

  var diff = Math.max(3, str.length - withoutWildcards.length)
  return 1 / Math.log(diff)
}

lunr.Token.prototype.toString = function () {
  return this.str
}

lunr.Token.prototype.valueOf = function () {
  return this.str
}

lunr.Token.prototype.toJSON = function () {
  return this.str
}

lunr.Token.prototype.transform = function (fn) {
  this.str = fn(this.str)
  return this
}

lunr.Token.prototype.merge = function (otherToken) {
  this.metadata.merge(otherToken.metadata)
}
