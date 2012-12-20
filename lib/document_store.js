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

lunr.Store.prototype.getNested = function (id, ref) {
  return this.store[id][ref]
}

lunr.Store.prototype.push = function (id, value) {
  if (!this.has(id)) this.set(id, {})
  this.store[id][value.ref] = value
}

lunr.Store.prototype.has = function (id) {
  return id in this.store
}

lunr.Store.prototype.remove = function (id) {
  if (id in this.store) {
    delete this.store[id]
    this.length--
  }
}

lunr.Store.prototype.reject = function (id, ref) {
  if (id in this.store && ref in this.store[id]) {
    delete this.store[id][ref]
    if (Object.keys(this.store[id]).length === 0) this.remove(id)
  }
}
