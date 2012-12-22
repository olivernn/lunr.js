lunr.Vector = function (elements) {
  this.elements = elements

  for (var i = 0; i < elements.length; i++) {
    if (!(i in this.elements)) this.elements[i] = 0
  }
}

lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elems = this.elements,
      len = elems.length,
      magnitude, el

  for (var i = 0; i < len; i++) {
    el = elems[i]
    sumOfSquares += el * el
  };

  return this._magnitude = Math.sqrt(sumOfSquares)
}

lunr.Vector.prototype.dot = function (otherVector) {
  var elem1 = this.elements,
      elem2 = otherVector.elements,
      length = elem1.length,
      dotProduct = 0

  for (var i = 0; i < length; i++) {
    dotProduct += elem1[i] * elem2[i]
  };

  return dotProduct
}

lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

lunr.Vector.prototype.toArray = function () {
  return this.elements
}
