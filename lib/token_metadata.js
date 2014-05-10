lunr.TokenMetadata = function () {
  this.store = {}
}

lunr.TokenMetadata.prototype.generateKey = function (k) {
  return "_" + k
}

lunr.TokenMetadata.prototype.add = function (k, val) {
  var key = this.generateKey(k)
  if (!this.store[key]) this.store[key] = []
  this.store[key].push(val)
}

lunr.TokenMetadata.prototype.get = function (k) {
  return this.store[this.generateKey(k)]
}

lunr.TokenMetadata.prototype.merge = function (other) {
  Object.keys(other.store).forEach(function (key) {
    if (!this.store[key]) this.store[key] = []
    this.store[key] = this.store[key].concat(other.store[key])
  }, this)
}
