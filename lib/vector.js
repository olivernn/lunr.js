/*!
 * lunr.Vector
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * lunr.Vectors implement vector related operations for
 * a series of elements.
 *
 * @constructor
 */
lunr.Vector = function () {
  this._magnitude = 0
  this.elements = []
}

/**
 * lunr.Vector.Node is a simple struct for each node
 * in a lunr.Vector.
 *
 * @private
 * @param {Number} The index of the node in the vector.
 * @param {Object} The data at this node in the vector.
 * @param {lunr.Vector.Node} The node directly after this node in the vector.
 * @constructor
 * @memberOf Vector
 */
lunr.Vector.Node = function (idx, val, next) {
  this.idx = idx
  this.val = val
  this.next = next
}

lunr.Vector.prototype.insert = function (insertIdx, val) {
  this._magnitude = 0

  if (this.elements.length == 0) {
    this.elements.push(insertIdx, val)
    return
  }

  var start = 0,
      end = this.elements.length,
      sliceLength = end - start,
      pivot = Math.floor((sliceLength / 2) / 2) * 2,
      pivotIdx = this.elements[pivot]

  while (sliceLength > 2) {
    if (pivotIdx == insertIdx) {
      throw "duplicate index"
    }

    if (insertIdx > pivotIdx) {
      start = pivot
    }

    if (insertIdx < pivotIdx) {
      end = pivot
    }

    sliceLength = end - start
    pivot = start + Math.floor((sliceLength / 2) / 2) * 2
    pivotIdx = this.elements[pivot]
  }

  if (pivotIdx > insertIdx) {
    this.elements.splice(pivot, 0 , insertIdx, val)
  }

  if (pivotIdx < insertIdx) {
    this.elements.splice(pivot + 2, 0 , insertIdx, val)
  }
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elementsLength = this.elements.length

  for (var i = 1; i < elementsLength; i += 2) {
    var val = this.elements[i]
    sumOfSquares += val * val
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector The vector to compute the dot product with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var dotProduct = 0,
      a = this.elements, b = otherVector.elements,
      aLen = a.length, bLen = b.length,
      aVal = 0, bVal = 0
      i = 0, j = 0

  while (i < aLen && j < bLen) {
    aVal = a[i], bVal = b[j]
    if (aVal < bVal) {
      i += 2
    } else if (aVal > bVal) {
      j += 2
    } else if (aVal == bVal) {
      dotProduct += a[i+1] * b[j+1]
      i += 2
      j += 2
    }
  }

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector The other vector to calculate the
 * similarity with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

lunr.Vector.prototype.toArray = function () {
  var output = new Array (this.elements.length / 2)

  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
    output[j] = this.elements[i]
  }

  return output
}
