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

lunr.StoreNode.prototype.allChildren = function() {
  var getChildren = function (node) {
    var nodes = Object.keys(node._branches)
      .map(function(chr) {
        return getChildren(node._branches[chr])
      }, node)

    nodes.unshift(node)
    return nodes
  }

  return lunr.utils.flatten(getChildren(this))
}
