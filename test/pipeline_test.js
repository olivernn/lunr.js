module('lunr.Pipeline', {
  setup: function () {
    this.existingRegisteredFunctions = lunr.Pipeline.registeredFunctions
    lunr.Pipeline.registeredFunctions = {}

    this.existingWarnIfFunctionNotRegistered = lunr.Pipeline.warnIfFunctionNotRegistered
    lunr.Pipeline.warnIfFunctionNotRegistered = $.noop
  },
  teardown: function () {
    lunr.Pipeline.registeredFunctions = this.existingRegisteredFunctions
    lunr.Pipeline.warnIfFunctionNotRegistered = this.existingWarnIfFunctionNotRegistered
  }
})

test("adding a new item to the pipeline", function () {
  var pipeline = new lunr.Pipeline
  equal(pipeline._stack.length, 0)

  pipeline.add($.noop)
  equal(pipeline._stack.length, 1)
})

test("adding multiple items to the pipeline in one go", function () {
  var pipeline = new lunr.Pipeline

  pipeline.add($.noop, $.noop)
  equal(pipeline._stack.length, 2)
})

test("removing an item from the pipeline", function () {
  var pipeline = new lunr.Pipeline,
      fn = $.noop

  pipeline.add(fn)
  equal(pipeline._stack.length, 1)

  pipeline.remove(fn)
  equal(pipeline._stack.length, 0)
})

test("removing a nonexistent item from the pipeline", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {}

  pipeline.add(fn1)
  equal(pipeline._stack.length, 1)

  pipeline.remove(fn2)
  equal(pipeline._stack.length, 1)
})

test("adding an item to the pipeline before another item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {}

  pipeline.add(fn1)
  pipeline.before(fn1, fn2)

  deepEqual(pipeline._stack, [fn2, fn1])
})

test("adding an item to the pipeline before nonexistent item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {}

  pipeline.add(fn1, fn2)

  throws(function () {
    pipeline.before(fn3, fn1)
  })

  deepEqual(pipeline._stack, [fn1, fn2])
})

test("adding an item to the pipeline after another item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {}

  pipeline.add(fn1, fn2)
  pipeline.after(fn1, fn3)

  deepEqual(pipeline._stack, [fn1, fn3, fn2])
})

test("adding an item to the pipeline after nonexistent item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {}

  pipeline.add(fn1, fn2)

  throws(function () {
    pipeline.after(fn3, fn1)
  })

  deepEqual(pipeline._stack, [fn1, fn2])
})

test("run calls each member of the pipeline for each input", function () {
  var pipeline = new lunr.Pipeline,
      count1 = 0, count2 = 0,
      fn1 = function (token) { count1++ ; return token },
      fn2 = function (token) { count2++ ; return token }

  pipeline.add(fn1, fn2)

  pipeline.run([1,2,3])

  equal(count1, 3)
  equal(count2, 3)
})

test("run should pass three inputs to the pipeline fn", function () {
  var pipeline = new lunr.Pipeline,
      input, index, arr,
      fn1 = function () { input = arguments[0], index = arguments[1], arr = arguments[2] }

  pipeline.add(fn1)

  pipeline.run(['a'])

  equal(input, 'a')
  equal(index, 0)
  deepEqual(arr, ['a'])
})

test("run should pass the output of one into the input of the next", function () {
  var pipeline = new lunr.Pipeline,
      output,
      fn1 = function (t1) { return t1.toUpperCase() },
      fn2 = function (t2) { output = t2 }

  pipeline.add(fn1)
  pipeline.add(fn2)

  pipeline.run(['a'])

  equal(output, 'A')
})

test("run should return the result of running the entire pipeline on each element", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = function (t1) { return t1.toUpperCase() }
  pipeline.add(fn1)
  deepEqual(pipeline.run(['a']), ['A'])
})

test("run should filter out any undefined values at each stage in the pipeline", function () {
  var pipeline = new lunr.Pipeline,
      fn2Count = 0,
      fn1 = function (t) { if (t < 5) return t },
      fn2 = function (t) { fn2Count++ ; return t }

  pipeline.add(fn1, fn2)

  var output = pipeline.run([0,1,2,3,4,5,6,7,8,9])
  equal(fn2Count, 5)
  equal(output.length, 5)
})

test('toJSON', function () {
  var pipeline = new lunr.Pipeline,
      fn1 = function () {},
      fn2 = function () {}

  lunr.Pipeline.registerFunction(fn1, 'fn1')
  lunr.Pipeline.registerFunction(fn2, 'fn2')

  pipeline.add(fn1, fn2)

  deepEqual(pipeline.toJSON(), ['fn1', 'fn2'])
})

test('registering a pipeline function', function () {
  var fn1 = function () {}

  equal(Object.keys(lunr.Pipeline.registeredFunctions).length, 0)

  lunr.Pipeline.registerFunction(fn1, 'fn1')

  equal(fn1.label, 'fn1')
  equal(Object.keys(lunr.Pipeline.registeredFunctions).length, 1)
  deepEqual(lunr.Pipeline.registeredFunctions['fn1'], fn1)
})

test('load', function () {
  var fn1 = function () {},
      fn2 = function () {}

  lunr.Pipeline.registerFunction(fn1, 'fn1')
  lunr.Pipeline.registerFunction(fn2, 'fn2')

  var serialised = ['fn1', 'fn2']

  var pipeline = lunr.Pipeline.load(serialised)

  equal(pipeline._stack.length, 2)
  deepEqual(pipeline._stack[0], fn1)
  deepEqual(pipeline._stack[1], fn2)
})

test('loading an un-registered pipeline function', function () {
  var serialised = ['fn1']

  throws(function () {
    lunr.Pipeline.load(serialised)
  })
})

test('resetting the pipeline', function () {
  var fn1 = function () {},
      fn2 = function () {},
      pipeline = new lunr.Pipeline

  pipeline.add(fn1, fn2)
  deepEqual(pipeline._stack, [fn1, fn2])

  pipeline.reset()
  deepEqual(pipeline._stack, [])
})
