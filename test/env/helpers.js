var equal_with_strings = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args[0],
      s1 = args[1],
      s2 = args[2] || args[1]

  equal(fn(new lunr.Token (s1)).toString(), s2)
}

