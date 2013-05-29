lunr.EventEmitter = function () {
  this.events = {}
}

lunr.EventEmitter.prototype.addListener = function (name, fn) {
  if (!(name in this.events)) this.events[name] = []

  this.events[name].push(fn)
}

lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!(name in this.events)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

