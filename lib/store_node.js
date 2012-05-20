lunr.StoreNode = function () {
  this._branches = {}
  this._values = []
}

lunr.StoreNode.prototype.at = function (chr) {
  return this._branches[chr] || (this._branches[chr] = new lunr.StoreNode)
}

lunr.StoreNode.prototype.push = function (value) {
  return this._values.push(value)
}