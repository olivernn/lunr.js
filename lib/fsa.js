lunr.FSA = function () {
  this.final = false
  this.edges = {}
}

lunr.FSA.fromArray = function (arr) {
  var builder = new lunr.FSABuilder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

lunr.FSA.fromString = function (str) {
  var node = new lunr.FSA
      root = node,
      wildcardFound = false

  for (var i = 0; i < str.length; i++) {
    var char = str[i],
        final = (i == str.length -1)

    if (char == "*") {
      wildcardFound = true
      node.edges[char] = node
      node.final = final
    } else {
      var next = new lunr.FSA
      next.final = final

      node.edges[char] = next
      node = next

      if (wildcardFound) {
        node.edges["*"] = root
      }
    }
  }

  return root
}

lunr.FSA.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop()

    if (frame.node.final) {
      words.push(frame.prefix)
    }

    for (var edge in frame.node.edges) {
      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words

}

lunr.FSA.prototype.toString = function () {
  var arr = []
  if (this.final) {
    arr.push(1)
  } else {
    arr.push(0)
  }

  Object.keys(this.edges).forEach(function (label) {
    arr.push(label)
    arr.push(this.edges[label].toString())
  }, this)

  return arr.join("_")
}

lunr.FSA.prototype.intersect = function (b) {
  var output = new lunr.FSA

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop()

    for (var qEdge in frame.qNode.edges) {

      for (var nEdge in frame.node.edges) {

        if (nEdge == qEdge || qEdge == '*') {
          var next = new lunr.FSA,
              node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge]

          next.final = node.final && qNode.final

          frame.output.edges[nEdge] = next

          stack.push({
            qNode: qNode,
            output: next,
            node: node
          })
        }
      }
    }
  }

  return output
}
