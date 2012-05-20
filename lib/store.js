lunr.Store = function () {
  this.root = new lunr.StoreNode
}

lunr.Store.prototype.get = function (term, node) {
  if (!term.length) return node
  if (term.length === 1 && term[0] === "*") return node.allChildren()

  return this.get(term.slice(1), node.at(term[0]))
}

lunr.Store.prototype.set = function (term, node, value) {
  if (!term.length) return node.push(value)

  return this.set(term.slice(1), node.at(term[0]), value)
}

lunr.Store.prototype.count = function (term, node) {
  return lunr.utils.arrayWrap(this.get(term, node)).reduce(function (total, node) {
    return total + node._values.length
  }, 0)
}
