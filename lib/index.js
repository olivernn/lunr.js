lunr.Index = function () {
  this._fields = []
  this._ref = 'id'
  this.pipeline = new lunr.Pipeline
  this.documentStore = new lunr.Store
  this.tokenStore = new lunr.TokenStore
  this.corpusTokens = new lunr.SortedSet
}

lunr.Index.prototype.field = function (fieldName, boost) {
  var field = { name: fieldName, boost: boost || 1 }
  this._fields.push(field)
  return this
}

lunr.Index.prototype.ref = function (refName) {
  this._ref = refName
  return this
}

lunr.Index.prototype.add = function (doc) {
  var docTokens = {},
      allDocumentTokens = new lunr.SortedSet,
      docRef = doc[this._ref]

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(lunr.tokenizer(doc[field.name]))

    docTokens[field.name] = fieldTokens
    lunr.SortedSet.prototype.add.apply(allDocumentTokens, fieldTokens)
  }, this)

  this.documentStore.set(docRef, allDocumentTokens)
  lunr.SortedSet.prototype.add.apply(this.corpusTokens, allDocumentTokens.toArray())

  for (var i = 0; i < allDocumentTokens.length; i++) {
    var token = allDocumentTokens.elements[i]
    var tf = this._fields.reduce(function (memo, field) {
      var tokenCount = docTokens[field.name].filter(function (t) { return t === token }).length,
          fieldLength = docTokens[field.name].length

      return memo + (tokenCount / fieldLength * field.boost)
    }, 0)

    this.tokenStore.add(token, { ref: docRef, tf: tf })
  };
}

lunr.Index.prototype.remove = function (doc) {
  var docRef = doc[this._ref],
      docTokens = this.documentStore.get(docRef)

  this.documentStore.remove(docRef)

  docTokens.forEach(function (token) {
    this.tokenStore.remove(token, docRef)
  }, this)
}

lunr.Index.prototype.update = function (doc) {
  this.remove(doc)
  this.add(doc)
}

lunr.Index.prototype.idf = function (term) {
  var documentFrequency = Object.keys(this.tokenStore.get(term)).length

  if (documentFrequency === 0) {
    return 1
  } else {
    return 1 + Math.log(this.tokenStore.length / documentFrequency)
  }
}

lunr.Index.prototype.search = function (query) {
  var queryTokens = this.pipeline.run(lunr.tokenizer(query)),
      queryArr = new Array (this.corpusTokens.length),
      documentSets = []

  if (!queryTokens.some(lunr.TokenStore.prototype.has, this.tokenStore)) return []

  queryTokens
    .filter(function (token) {
      return this.tokenStore.has(token)
    }, this)
    .forEach(function (token, i, tokens) {
      var fieldBoosts = this._fields.reduce(function (memo, f) { return memo + f.boost }),
          tf = 1 / tokens.length * this._fields.length,
          idf = this.idf(token),
          pos = this.corpusTokens.indexOf(token),
          set = new lunr.SortedSet

      if (pos > -1) queryArr[pos] = tf * idf

      Object.keys(this.tokenStore.get(token)).forEach(function (ref) { set.add(ref) })
      documentSets.push(set)
    }, this)

  debugger

  var documentSet = documentSets.reduce(function (memo, set) {
    return memo.intersect(set)
  })

  var queryVector = new lunr.Vector (queryArr)

  var documentScores = documentSet.map(function (documentRef) {
    var documentTokens = this.documentStore.get(documentRef),
        documentTokensLength = documentTokens.length,
        documentArr = new Array (this.corpusTokens.length)

    for (var i = 0; i < documentTokensLength; i++) {
      var token = documentTokens.elements[i],
          tf = this.tokenStore.get(token)[documentRef].tf,
          idf = this.idf(token)

      documentArr[this.corpusTokens.indexOf(token)] = tf * idf
    };

    var vector = new lunr.Vector (documentArr)

    return { ref: documentRef, score: queryVector.similarity(vector) }
  }, this)

  return documentScores.sort(function (a, b) {
    return b.score - a.score
  })
}
