lunr.Set = function (elements) {
  this.elements = Object.create(null)

  if (elements) {
    this.length = elements.length

    for (var i = 0; i < this.length; i++) {
      this.elements[elements[i]] = true
    }
  } else {
    this.length = 0
  }
}

lunr.Set.complete = {
  intersect: function (other) {
    return other
  },

  union: function (other) {
    return other
  },

  contains: function (object) {
    return true
  }
}

lunr.Set.empty = {
  intersect: function (other) {
    return this
  },

  union: function (other) {
    return other
  },

  contains: function (object) {
    return false
  },
}

lunr.Set.prototype.contains = function (object) {
  return !!this.elements[object]
}

lunr.Set.prototype.intersect = function (other) {
  var a, b, elements, intersection = []

  if (this.length < other.length) {
    a = this
    b = other
  } else {
    a = other
    b = this
  }

  elements = Object.keys(a.elements)

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    if (element in b.elements) {
      intersection.push(element)
    }
  }

  return new lunr.Set (intersection)
}

lunr.Set.prototype.union = function (other) {
  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))
}
