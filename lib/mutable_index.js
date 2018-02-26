lunr.MutableIndex = function (attrs) {
  lunr.Index.call(this, attrs)
  this.builder = attrs.builder
  this._dirty = false
}

lunr.MutableIndex.prototype = new lunr.Index({})

lunr.MutableIndex.prototype.add = function add (doc) {
  this.builder.add(doc)
  this._dirty = true
}

lunr.MutableIndex.prototype.update = function update (doc) {
  this.remove(doc)
  this.add(doc)
}

lunr.MutableIndex.prototype.remove = function remove (doc) {
  this.builder.remove(doc)
  this._dirty = true
}

// XXX rebuilds the entire index =(
// XXX refreshing this from newIndex is kinda wonky =(
lunr.MutableIndex.prototype.checkDirty = function checkDirty () {
  if (this._dirty) {
    this._dirty = false
    var newIndex = this.builder.build()
    for (var k in newIndex) {
      if (newIndex.hasOwnProperty(k)) {
        this[k] = newIndex[k]
      }
    }
  }
}

lunr.MutableIndex.prototype.toJSON = function toJSON () {
  this.checkDirty()

  var json = lunr.Index.prototype.toJSON.call(this)
  json.builder = this.builder.toJSON()
  return json
}

lunr.MutableIndex.load = function load (serializedIndex) {
  var index = lunr.Index.load(serializedIndex)
  var mutableIndex = new lunr.MutableIndex({})

  for (var k in index) {
    if (index.hasOwnProperty(k)) {
      mutableIndex[k] = index[k]
    }
  }

  mutableIndex.builder = lunr.MutableBuilder.load(serializedIndex.builder)
  mutableIndex.builder.invertedIndex = mutableIndex.invertedIndex
  mutableIndex.builder._fields = mutableIndex.fields
  mutableIndex.builder.searchPipeline = mutableIndex.pipeline
  mutableIndex.dirty = false

  return mutableIndex
}

lunr.MutableIndex.prototype.query = function query (fn) {
  this.checkDirty()

  return lunr.Index.prototype.query.call(this, fn)
}
