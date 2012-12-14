lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)
  Array.prototype.push.apply(this._stack, fns)
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
  var pipelineItem = function (tokenIdx) {
    return function (memo, fn) {
      if (memo === void 0) return
      return fn(memo, tokenIdx, tokens)
    }
  }

  return tokens
    .map(function (token, idx) {
      return this._stack.reduce(pipelineItem(idx), token)
    }, this)
    .filter(function (token) {
      return token !== void 0
    })
}

lunr.Pipeline.prototype.size = function () {
  return this._stack.length
}

lunr.Pipeline.prototype.toArray = function () {
  return this._stack.slice()
}
