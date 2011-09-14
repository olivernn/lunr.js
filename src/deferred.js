/*!
 * Lunr - Deferred
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Lunr.Deferred is an implementation of a deferred object and is used throughout the Lunr library for
 * dealing with asynchronous calls and requests.  A deferred object can either be stand-alone or wrap other
 * instances of Lunr.Defered objects.
 *
 * When used as a stand-alone deferred the object is initially in a non-resolved state, callbacks can be
 * attached using the `then` method.  Once the asynchronous activity that the deferred is representing has
 * completed the deferred object can be resolved two ways, either succesfully or unsuccesfully with the
 * `resolve` and `fail` methods respectively.
 *
 * It is possible to attach callbacks to the deferred object even after it has been resolved, the callbacks
 * will be executed immediately.
 *
 * @constructor
 * @param {Array} an optional list of deferred objects to wrap.
 *
 * ### Example
 *     var deferred = new Lunr.Deferred ()
 *     deferred.then(function () { console.log('success') })
 *     deferred.resolve() // 'success' will be logged.
 */
Lunr.Deferred = function (deferreds) {
  this.state = null
  this.successCallbacks = []
  this.failCallbacks = []
  this.deferreds = deferreds || []
  var self = this
  var counter = 0
  var output = []

  this.deferreds.forEach(function (deferred) {
    deferred.then(function (returnVal) {
      output.push(returnVal)
      if (++counter == deferreds.length) self.resolve(output)
    }, function () {
      self.fail()
    })
  })

}

Lunr.Deferred.prototype = {
  /**
   * ## Lunr.Deferred.prototype.resolve
   * A method to resolve this deferred instance.  An optional context object can be passed which will be
   * passed to every success callback.  The context of the success callbacks will also be set to this object.
   *
   * When resolving a deferred object the state of the deferred object will be changed to 'success'.  A
   * deferred object can only be resolved once.  All further success callbacks attached will be executed 
   * imediatly after the deferred has been resolved.
   *
   * @param {Object} a context object which will be passed to all success callbacks
   */
  resolve: function (ctx) {
    if (!this.state) {
      this.ctx = ctx
      this.state = 'success'
      this.successCallbacks.forEach(function (callback) {
        callback.call(ctx, ctx)
      })
    };
    return this
  },

  /**
   * ## Lunr.Deferred.prototype.fail
   * A method to fail this deferred instance.  An optional context object can be passed which will be
   * passed to every failure callback.  The context of the failure callbacks will also be set to this object.
   *
   * When failing a deferred object the state of the deferred object will be changed to 'failed'.  A
   * deferred object can only be failed once.  All further failure callbacks attached will be executed 
   * imediatly after the deferred has been failed.
   *
   * @param {Object} a context object which will be passed to all failed callbacks
   */
  fail: function (ctx) {
    if (!this.state) {
      this.ctx = ctx
      this.state = 'failed'
      this.failCallbacks.forEach(function (callback) {
        callback.call(ctx, ctx)
      })
    };
    return this
  },

  /**
   * ## Lunr.Deferred.prototype.then
   * The `then` method allows both success and failure callbacks to be attatched to the deferred object.
   * If the deferred object has still to be resolved or failed then these callbacks will be added to the
   * internal list of success and fail callbacks.  If the deferred object has already been resolved or
   * failed then the respective callback will be executed immediately.
   *
   * Both success and fail callbacks will be passed any context object with which the deferred was resolved
   * or failed with.  The context of the callback functions will also be set to this object.
   *
   * @param {Function} success - a callback to be called when the deferred is resolved
   * @param {Function} fail - a callback to be called when the deferred is failed.
   * @returns {Lunr.Deferred} returns this instance to allow for chaining.
   *
   * ### Example
   *     deferred.then(function () { console.log('success') })
   */
  then: function (success, fail) {
    if (this.state) {
      if (this.state == 'success' && success) success.call(this.ctx, this.ctx)
      if (this.state == 'failed' && fail) fail.call(this.ctx, this.ctx)
    } else {
      if (success) this.successCallbacks.push(success)
      if (fail) this.failCallbacks.push(fail)
    };
    return this;
  },

  /**
   * ## Lunr.Deferred.prototype.thenLog
   * A convenience function for debugging and development purposes.  Adds a success callback that simply
   * logs the context argument.
   *
   * @returns {Lunr.Deferred} returns this instance to allow for chaining.
   */
  thenLog: function (msg) {
    this.then(function () {
      if (msg) {
        console.log(msg)
      } else {
        console.log(this)
      }
    })
    return this;
  }
}