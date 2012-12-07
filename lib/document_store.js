lunr.Store = function () {
  this.store = {}
  this.length = 0
}

lunr.Store.prototype.set = function (id, tokens) {
  this.store[id] = tokens
  this.length = Object.keys(this.store).length
}

lunr.Store.prototype.get = function (id, tokens) {
  return this.store[id]
}

lunr.Store.prototype.push = function (id, value) {
  if (id in this.store && Array.isArray(this.store[id])) this.store[id].push(value)
  if (!(id in this.store)) this.set(id, [value])
}

lunr.Store.prototype.has = function (id) {
  return id in this.store
}
