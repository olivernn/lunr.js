lunr.TokenMetadataStore = function() {
  this.store = {}
}

lunr.TokenMetadataStore.prototype.add = function(docRef, token) {
  if(!(token instanceof lunr.Token)){
    throw new Error ("Must add lunr.Token to TokenMetadataStore")
  }

  var idxVal = token.indexedAs

  if(!idxVal) return

  this.store[docRef] = this.store[docRef] || {}
  this.store[docRef][idxVal] = this.store[docRef][idxVal] || []

  this.store[docRef][idxVal].push(token);
}

lunr.TokenMetadataStore.prototype.get = function(docRef, idxVal) {
  if(this.store[docRef] && this.store[docRef][idxVal]) {
    return this.store[docRef][idxVal]
  } else {
    return null
  }
}

lunr.TokenMetadataStore.prototype.getAll = function(docRef, idxValArray) {
  out = []
  idxValArray.forEach(function(idxVal) {
    var tokens = this.get(docRef, idxVal)
    if(tokens) {
      tokens.forEach(function(token) {
        if(token) {
          out.push(token.toJSON())
        }
      })
    }
  }, this)
  return out
}

lunr.TokenMetadataStore.prototype.remove = function(docRef) {
  delete this.store[docRef]
}

lunr.TokenMetadataStore.prototype.toJSON = function() {
  return {
    store: this.store
  }
}
