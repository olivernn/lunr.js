lunr.EventEmitter = function () {
  this.events = {}
}

lunr.EventEmitter.prototype.addListener = function (name, fn) {
  if (!this.hasHandler(name)) this.events[name] = []

  this.events[name].push(fn)
}

lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

lunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return

  var args = Array.prototype.slice.call(arguments, 1)

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args)
  })
}

lunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events
}

