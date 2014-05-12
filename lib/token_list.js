lunr.TokenList = function(elms) {
  this.elements = []
  this.length = 0

  if(elms) {
    this.setList(elms)
  }
}

lunr.TokenList.prototype.push = function(token) {
  if(!token instanceof lunr.Token){
    throw new Error ('Cannot add type ' + typeof(token) + " to a token list, must be lunr.Token")
  }
  this.elements.push(token)
  this.length++
}

lunr.TokenList.prototype.get = function(index) {
  return this.elements[index]
}

lunr.TokenList.prototype.setList = function(elements) {
  this.elements = elements
  this.length = this.elements.length
}

lunr.TokenList.prototype.toArray = function() {
  return Array.prototype.slice.call(this.elements, 0)
}

lunr.TokenList.prototype.indexTokens = function() {
  return this.elements.map(function(token) {
    return token.indexedAs
  })
}

lunr.TokenList.prototype.rawTokens = function() {
  return this.elements.map(function(token) {
    return token.raw
  })
}
