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
  var out = [],
      tokenLength = tokens.length,
      stackLength = this._stack.length

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i]

    for (var j = 0; j < stackLength; j++) {
      token = this._stack[j](token, i, tokens)
      if (token === void 0) break
    };

    if (token !== void 0) out.push(token)
  };

  return out
}

lunr.Pipeline.prototype.size = function () {
  return this._stack.length
}

lunr.Pipeline.prototype.toArray = function () {
  return this._stack.slice()
}
