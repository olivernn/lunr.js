lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.prototype.add = function (fn) {
  this._stack.push(fn)
}

lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  var pos = this._stack.indexOf(existingFn) + 1
  this._stack.splice(pos, 0, newFn)
}

lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  var pos = this._stack.indexOf(existingFn)
  this._stack.splice(pos, 0, newFn)
}

lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  this._stack.splice(pos, 1)
}

lunr.Pipeline.prototype.run = function (tokens) {
  var pipelineItem = function (memo, fn, idx) { return fn(memo, idx, tokens) }

  return tokens.map(function (token) {
    return this._stack.reduce(pipelineItem, token)
  }, this)
}

lunr.Pipeline.prototype.size = function () {
  return this._stack.length
}

lunr.Pipeline.prototype.toArray = function () {
  return this._stack.slice()
}
