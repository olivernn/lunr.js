lunr.MutableIndex = function (attrs) {
  lunr.Index.call(this, attrs)
  this.builder = attrs.builder
}

lunr.MutableIndex.prototype = new lunr.Index({})

// XXX rebuilds the entire index =(
// XXX refreshing this from newIndex is kinda wonky =(
lunr.MutableIndex.prototype.add = function add (doc) {
  this.builder.add(doc)

  var newIndex = this.builder.build()
  for (var k in newIndex) {
    if (newIndex.hasOwnProperty(k)) {
      this[k] = newIndex[k]
    }
  }
}

// XXX rebuilds the index twice
lunr.MutableIndex.prototype.update = function update (doc) {
  this.remove(doc)
  this.add(doc)
}

// XXX rebuilds the entire index =(
// XXX refreshing this from newIndex is kinda wonky =(
lunr.MutableIndex.prototype.remove = function remove (doc) {
  this.builder.remove(doc)

  var newIndex = this.builder.build()
  for (var k in newIndex) {
    if (newIndex.hasOwnProperty(k)) {
      this[k] = newIndex[k]
    }
  }
}
