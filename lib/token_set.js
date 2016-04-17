lunr.TokenSet = function () {
  this.final = false
  this.edges = {}
}

lunr.TokenSet.fromArray = function (arr) {
  var builder = new lunr.TokenSet.Builder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

// NOTE: the following edits are treated as an edit distance of 1:
// * insertion
// * deletion
// * substitution
// Currently this does not make special allowance for transposition
// though it may do in the future.
lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
  var root = new lunr.TokenSet

  var stack = [{
    node: root,
    editsRemaining: editDistance,
    str: str
  }]

  while (stack.length) {
    var frame = stack.pop()

    // no edit
    if (frame.str.length > 0) {
      var char = frame.str.charAt(0),
          noEditNode

      if (char in frame.node.edges) {
        noEditNode = frame.node.edges[char]
      } else {
        noEditNode = new lunr.TokenSet
        frame.node.edges[char] = noEditNode
      }

      if (frame.str.length == 1) {
        noEditNode.final = true
      } else {
        stack.push({
          node: noEditNode,
          editsRemaining: frame.editsRemaining,
          str: frame.str.slice(1)
        })
      }
    }

    // deletion
    // can only do a deletion if we have enough edits remaning
    // and if there are characters left to delete in the string
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var char = frame.str.charAt(1),
          deletionNode

      if (char in frame.node.edges) {
        deletionNode = frame.node.edges[char]
      } else {
        deletionNode = new lunr.TokenSet
        frame.node.edges[char] = deletionNode
      }

      if (frame.str.length <= 2) {
        deletionNode.final = true
      } else {
        stack.push({
          node: deletionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(2)
        })
      }
    }

    // deletion
    // just removing the last character from the str
    if (frame.editsRemaining > 0 && frame.str.length == 1) {
      frame.node.final = true
    }

    // substitution
    // can only do a substition if we have enough edits remaining
    // and if there are characters left to substitute
    if (frame.editsRemaining > 0 && frame.str.length >= 1) {
      if ("*" in frame.node.edges) {
        var substitutionNode = frame.node.edges["*"]
      } else {
        var substitutionNode = new lunr.TokenSet
        frame.node.edges["*"] = substitutionNode
      }

      if (frame.str.length == 1) {
        substitutionNode.final = true
      } else {
        stack.push({
          node: substitutionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        })
      }
    }

    // insertion
    // can only do insertion if there are edits remaining
    if (frame.editsRemaining > 0) {
      if ("*" in frame.node.edges) {
        var insertionNode = frame.node.edges["*"]
      } else {
        var insertionNode = new lunr.TokenSet
        frame.node.edges["*"] = insertionNode
      }

      if (frame.str.length == 0) {
        insertionNode.final = true
      } else {
        stack.push({
          node: insertionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str
        })
      }
    }
  }

  return root
}

lunr.TokenSet.fromString = function (str) {
  var node = new lunr.TokenSet
      root = node,
      wildcardFound = false

  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i],
        final = (i == len - 1)

    if (char == "*") {
      wildcardFound = true
      node.edges[char] = node
      node.final = final

    } else {
      var next = new lunr.TokenSet
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

lunr.TokenSet.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop(),
        edges = Object.keys(frame.node.edges),
        len = edges.length

    if (frame.node.final) {
      words.push(frame.prefix)
    }

    for (var i = 0; i < len; i++) {
      var edge = edges[i]

      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words
}

lunr.TokenSet.prototype.toString = function () {
  // NOTE: Using Object.keys here as this.edges is very likely
  // to enter 'hash-mode' with many keys being added
  //
  // avoiding a for-in loop here as it leads to the function
  // being de-optimised (at least in V8). From some simple
  // benchmarks the performance is comparable, but allowing
  // V8 to optmisie may mean easy performance wins in the future.

  var str = this.final ? '1' : '0',
      labels = Object.keys(this.edges),
      len = labels.length

  for (var i = 0; i < len; i++) {
    var label = labels[i],
        node = this.edges[label]

    str = str + label + node.toString()
  }

  return str
}

lunr.TokenSet.prototype.intersect = function (b) {
  var output = new lunr.TokenSet,
      frame = undefined

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    frame = stack.pop()

    // NOTE: As with the #toString method, we are using
    // Object.keys and a for loop instead of a for-in loop
    // as both of these objects enter 'hash' mode, causing
    // the function to be de-optimised in V8
    var qEdges = Object.keys(frame.qNode.edges),
        qLen = qEdges.length
        nEdges = Object.keys(frame.node.edges),
        nLen = nEdges.length

    for (var q = 0; q < qLen; q++) {
      var qEdge = qEdges[q]

      for (var n = 0; n < nLen; n++) {
        var nEdge = nEdges[n]

        if (nEdge == qEdge || qEdge == '*') {
          var node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge],
              final = node.final && qNode.final,
              next = undefined

          if (nEdge in frame.output.edges) {
            // an edge already exists for this character
            // no need to create a new node, just set the finality
            // bit unless this node is already final
            next = frame.output.edges[nEdge]
            next.final = next.final || final

          } else {
            // no edge exists yet, must create one
            // set the finality bit and insert it
            // into the output
            next = new lunr.TokenSet
            next.final = final
            frame.output.edges[nEdge] = next
          }

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
