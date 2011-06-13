Search.Deferred = function (deferreds) {
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

Search.Deferred.prototype = {
  resolve: function (ctx) {
    if (!this.state) {
      this.ctx = ctx
      this.state = 'success'
      this.successCallbacks.forEach(function (callback) {
        callback.call(ctx, ctx)
      })
    };
  },

  fail: function (ctx) {
    if (!this.state) {
      this.ctx = ctx
      this.state = 'failed'
      this.failCallbacks.forEach(function (callback) {
        callback.call(ctx, ctx)
      })
    };
  },

  then: function (success, fail) {
    if (this.state) {
      if (this.state = 'success' && success) success.call(this.ctx, this.ctx)
      if (this.state = 'failed' && fail) fail.call(this.ctx, this.ctx)
    } else {
      this.successCallbacks.push(success)
      this.failCallbacks.push(fail)
    };
    return this;
  },

  thenLog: function () {
    this.then(function () {
      console.log(this)
    })
    return this;
  }
}