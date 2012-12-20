lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

lunr.SortedSet.prototype.add = function () {
  Array.prototype.slice.call(arguments).forEach(function (element) {
    if (~this.elements.indexOf(element)) return
    this.elements.splice(this.locationFor(element), 0, element)
  }, this)

  this.length = this.elements.length
}

lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice()
}

lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx)
}

lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx)
}

lunr.SortedSet.prototype.indexOf = function (elem) {
  return this.elements.indexOf(elem)
}

lunr.SortedSet.prototype.locationFor = function (elem, start, end) {
  var start = start || 0,
      end = end || this.elements.length - 1,
      pivot = Math.ceil(start + (end - start) / 2),
      pivotElem = this.elements[pivot]

  if (end - start <= 1 || pivotElem === elem) return pivot
  if (pivotElem < elem) return this.locationFor(elem, pivot, end)
  return this.locationFor(elem, start, pivot)
}
