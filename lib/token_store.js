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

lunr.TokenStore.prototype.getNode = function (token, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) return {}

  if (rest.length === 0) {
    return root[key]
  } else {
    return this.getNode(rest, root[key])
  }
}

lunr.TokenStore.prototype.get = function (token, root) {
  return this.getNode(token).docs || {}
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

lunr.TokenStore.prototype.expand = function (token, memo) {
  var root = this.getNode(token),
      docs = root.docs || {},
      memo = memo || []

  if (Object.keys(docs).length) memo.push(token)

  Object.keys(root)
    .forEach(function (key) {
      if (key === 'docs') return

      memo.concat(this.expand(token + key, memo))
    }, this)

  return memo
}

