lunr.FSABuilder = function () {
  this.previousWord = ""
  this.root = new lunr.FSA
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.FSABuilder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.FSA,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.FSABuilder.prototype.finish = function () {
  this.minimize(0)
}

lunr.FSABuilder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i]

    if (node.child in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[node.child]
    } else {
      this.minimizedNodes[node.child] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
