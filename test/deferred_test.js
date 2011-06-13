module("Deferred")

test("adding success callbacks to an unresolved deferred object", function () {
  var deferred = new Search.Deferred ()

  deferred.then(function () {})

  equal(deferred.successCallbacks.length, 1, "should store the success callback")
})

test("adding fail and success callbacks to an unresolved deferred object", function () {
  var deferred = new Search.Deferred ()

  deferred.then(function () {}, function () {})

  equal(deferred.successCallbacks.length, 1, "should store the success callback")
  equal(deferred.failCallbacks.length, 1, "should store the fail callback")
})

test("should have a state of null before being resolved", function () {
  var deferred = new Search.Deferred ()

  equal(deferred.state, null, "should have a state of null before being resolved")
})

test("succesfully resolving a deferred object", function () {
  var deferred = new Search.Deferred ()
  var successCalled = false
  var failCalled = false

  deferred.then(function () {
    successCalled = true
  }, function () {
    failCalled = true
  })

  deferred.resolve()

  ok(successCalled, "should have called the success callback")
  ok(!failCalled, "should not have called the failed callback")
  equal(deferred.state, "success", "should have a state of resolved")
})

test("failing a deferred object", function () {
  var deferred = new Search.Deferred ()
  var successCalled = false
  var failCalled = false

  deferred.then(function () {
    successCalled = true
  }, function () {
    failCalled = true
  })

  deferred.fail()

  ok(!successCalled, "should not have called the success callback")
  ok(failCalled, "should have called the failed callback")
  equal(deferred.state, "failed", "should have a state of resolved")
})

test("resolving a deferred with a context object", function () {
  var deferred = new Search.Deferred ()
  var successCtx = null
  var yieldedCtx = null
  var context = {}

  deferred.then(function (ctx) {
    successCtx = this
    yieldedCtx = ctx
  })

  deferred.resolve(context)

  same(successCtx, context, "context should be yielded at this")
  same(yieldedCtx, context, "context should be yielded as an argument")
  same(deferred.ctx, context, "should store the context object")
})

test("failing a deferred with a context object", function () {
  var deferred = new Search.Deferred ()
  var failedCtx = null
  var yieldedCtx = null
  var context = {}

  deferred.then($.noop, function (ctx) {
    failedCtx = this
    yieldedCtx = ctx
  })

  deferred.fail(context)

  same(failedCtx, context, "context should be yielded at this")
  same(yieldedCtx, context, "context should be yielded as an argument")
  same(deferred.ctx, context, "should store the context object")
})

test("adding callbacks to an already resolved deferred object", function () {
  var deferred = new Search.Deferred ()
  var callbackCalled = false

  deferred.resolve()

  deferred.then(function () {
    callbackCalled = true
  })

  ok(callbackCalled, "should imediatly call the correct callback if the deferred is already resolved")
})

test("creating a deferred with other deferreds", function () {
  var callbackCalled = false

  var d1 = new Search.Deferred ()
  var d2 = new Search.Deferred ()
  var d3 = new Search.Deferred ([d1, d2])

  d3.then(function () {
    callbackCalled = true
  })

  d1.resolve()
  d2.resolve()

  ok(callbackCalled, "should resolve the wrapping deferred when all container deferreds are resolved")
})

test("a deferred with other deferreds", function () {
  var callbackCalled = false
  var failed = false

  var d1 = new Search.Deferred ()
  var d2 = new Search.Deferred ()
  var d3 = new Search.Deferred ([d1, d2])

  d3.then(function () {
    callbackCalled = true
  }, function () {
    failed = true
  })

  d1.resolve()
  d2.fail()

  ok(failed, "should fail the wrapping deferred when any of the wrapped deferreds are failed")

})