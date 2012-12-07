lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

lunr.SortedSet.prototype.add = function () {
  Array.prototype.slice.call(arguments).forEach(function (element) {
    if (~this.elements.indexOf(element)) return
    this.elements.push(element)
  }, this)

  this.length = this.elements.length
}

lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice().sort()
}

lunr.SortedSet.prototype.map = function (fn, ctx) {
  return Array.prototype.map.call(this.toArray(), fn, ctx)
}

lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return Array.prototype.forEach.call(this.toArray(), fn, ctx)
}

lunr.SortedSet.prototype.indexOf = function (elem) {
  return Array.prototype.indexOf.call(this.toArray(), elem)
}
