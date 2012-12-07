lunr.Vector = function (elements) {
  this.elements = elements
  for (var i = 0; i < elements.length; i++) {
    if (!(i in this.elements)) this.elements[i] = 0
  }
  if (elements.length === 1) this.elements.unshift(1)
}

lunr.Vector.prototype.magnitude = function () {
  return Math.sqrt(this.elements.reduce(function (memo, element) { return memo + (element * element) }, 0))
}

lunr.Vector.prototype.dot = function (otherVector) {
  return this.elements.reduce(function (memo, element, idx) {
    return memo + (element * otherVector.elements[idx])
  }, 0)
}

lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

lunr.Vector.prototype.toArray = function () {
  return this.elements
}
