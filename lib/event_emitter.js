/*!
 * lunr.EventEmitter
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * lunr.EventEmitter is an event emitter for lunr. It manages adding and removing event handlers and triggering events and their handlers.
 *
 * @constructor
 */
lunr.EventEmitter = function () {
  this.events = {}
}

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} handler The function to call when an event is fired.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.addListener = function () {
  var i, fn, name

  if (arguments.length < 2) throw new TypeError("missing parameters")
  fn = arguments[arguments.length - 1]
  if (typeof fn !== "function") throw new TypeError ("last argument must be a function")

  for (i = 0; i < arguments.length - 1; ++i) {
    name = arguments[i]
    if (!this.hasHandler(name)) this.events[name] = []
    this.events[name].push(fn)
  }
}

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} handler The function to remove from an event.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

/**
 * Calls all functions bound to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return

  var i,
      args = new Array(arguments.length - 1)
      event = this.events[name]

  for (i = 0; i < args.length; ++i) {
    args[i] = arguments[i + 1]
  }

  for (i = 0; i < event.length; ++i) {
    event[i].apply(undefined, args)
  }
}

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events
}

