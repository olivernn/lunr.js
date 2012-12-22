lunr.TokenStore = function () {
  this.root = { docs: {} }
  this.length = 0
}

lunr.TokenStore.prototype.add = function (token, doc, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) root[key] = {docs: {}}

  if (rest.length === 0) {
    root[key].docs[doc.ref] = doc
    this.length += 1
    return
  } else {
    return this.add(rest, doc, root[key])
  }
}

lunr.TokenStore.prototype.has = function (token, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) return false

  if (rest.length === 0) {
    return true
  } else {
    return this.has(rest, root[key])
  }
}

lunr.TokenStore.prototype.get = function (token, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) return {}

  if (rest.length === 0) {
    return root[key].docs
  } else {
    return this.get(rest, root[key])
  }
}

lunr.TokenStore.prototype.remove = function (token, ref, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) return

  if (rest.length === 0) {
    delete root[key].docs[ref]
    this.length -= 1
  } else {
    return this.remove(rest, ref, root[key])
  }
}

lunr.TokenStore.prototype.getAll = function (r) {
  var r = r || this.root,
      root = $.extend({}, r),
      self = this

  return Object.keys(root)
    .reduce(function (memo, key) {
      if (key === 'docs') return memo

      var otherDocs = $.extend({}, self.getAll(root[key]))

      Object.keys(otherDocs)
        .forEach(function (key) {
          if (key in memo) {
            memo[key].tf += otherDocs[key].tf
          } else {
            memo[key] = otherDocs[key]
          }
        })

      return memo
    }, docs)
}
