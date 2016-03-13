lunr.FSABuilder = function () {
  this.previousWord = ""
  this.root = new lunr.FSA
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.FSABuilder.prototype.insert = function (word) {
  var node

  if (word < this.previousWord) {
    throw "out of order word insertion"
  }

  var commonPrefix = 0
  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix += 1
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1][2]
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.FSA,
        letter = word[i]
    node.edges[letter] = nextNode
    this.uncheckedNodes.push([node, letter, nextNode])
    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.FSABuilder.prototype.finish = function () {
  this.minimize(0)
}

lunr.FSABuilder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length -1; i >= downTo; i--) {
    var tuple = this.uncheckedNodes[i],
        parent = tuple[0],
        letter = tuple[1],
        child = tuple[2]

    if (child in this.minimizedNodes) {
      parent.edges[letter] = this.minimizedNodes[child]
    } else {
      this.minimizedNodes[child] = child
    }

    this.uncheckedNodes.pop()
  }
}
