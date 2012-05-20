lunr.Store = function () {
  this.root = new lunr.StoreNode
}

lunr.Store.prototype.get = function (term, node) {
  if (!term.length) return node

  return this.get(term.slice(1), node.at(term[0]))
}

lunr.Store.prototype.set = function (term, node, value) {
  if (!term.length) return node.push(value)

  return this.set(term.slice(1), node.at(term[0]), value)
}

lunr.Store.prototype.count = function (term, node) {
  return this.get(term, node)._values.length
}
