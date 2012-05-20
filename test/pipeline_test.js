module('pipeline')

test("adding a new item to the pipeline", function () {
  var pipeline = new lunr.Pipeline
  equal(pipeline.size(), 0)

  pipeline.add($.noop)
  equal(pipeline.size(), 1)
})

test("removing an item from the pipeline", function () {
  var pipeline = new lunr.Pipeline,
      fn = $.noop

  pipeline.add(fn)
  equal(pipeline.size(), 1)

  pipeline.remove(fn)
  equal(pipeline.size(), 0)
})

test("adding an item to the pipeline before another item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {}

  pipeline.add(fn1)
  pipeline.before(fn1, fn2)

  same(pipeline.toArray(), [fn2, fn1])
})

test("adding an item to the pipeline after another item", function () {
  var pipeline = new lunr.Pipeline,
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = console.log

  pipeline.add(fn1)
  pipeline.add(fn2)
  pipeline.after(fn1, fn3)

  same(pipeline.toArray(), [fn1, fn3, fn2])
})

test("run mcalls each member of the pipeline for each input", function () {
  var pipeline = new lunr.Pipeline,
      count1 = 0, count2 = 0
      fn1 = function () { count1++ },
      fn2 = function () { count2++ }

  pipeline.add(fn1)
  pipeline.add(fn2)

  pipeline.run([1,2,3])

  equal(count1, 3)
  equal(count2, 3)
})

test("run should pass three inputs to the pipeline fn", function () {
  var pipeline = new lunr.Pipeline,
      input, index, arr
      fn1 = function () { input = arguments[0], index = arguments[1], arr = arguments[2] }

  pipeline.add(fn1)

  pipeline.run(['a'])

  equal(input, 'a')
  equal(index, 0)
  same(arr, ['a'])
})

test("run should pass the output of one into the input of the next", function () {
  var pipeline = new lunr.Pipeline,
      output,
      fn1 = function (t1) { return t1.toUpperCase() }
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
  same(pipeline.run(['a']), ['A'])
})