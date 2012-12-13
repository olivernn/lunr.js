lunr.Index = function () {
  this._fields = []
  this._ref = 'id'
  this.pipeline = new lunr.Pipeline
  this.documentStore = new lunr.Store
  this.tokenStore = new lunr.Store
  this.corpusTokens = new lunr.SortedSet

  this.pipeline.add(function (t) { return t.toLowerCase() })
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
  var self = this

  var allDocumentTokens = this._fields.reduce(function (memo, field) {
    var tokens = lunr.tokenizer(doc[field.name])
    lunr.SortedSet.prototype.add.apply(memo, self.pipeline.run(tokens))
    return memo
  }, new lunr.SortedSet)

  this.documentStore.set(doc[this._ref], allDocumentTokens)

  lunr.SortedSet.prototype.add.apply(this.corpusTokens, allDocumentTokens.toArray())

  allDocumentTokens.forEach(function (token) {
    var tf = this._fields.reduce(function (memo, field) {
      var tokens = lunr.tokenizer(doc[field.name]),
          tokenCount = self.pipeline.run(tokens).filter(function (t) { return t === token }).length,
          fieldLength = tokens.length

      return memo + (tokenCount / fieldLength * field.boost)
    }, 0)

    this.tokenStore.push(token, { ref: doc[this._ref], tf: tf })
  }, this)
}

lunr.Index.prototype.remove = function (doc) {
  var docRef = doc[this._ref],
      docTokens = this.documentStore.get(docRef)

  this.documentStore.remove(docRef)

  docTokens.forEach(function (token) {
    this.tokenStore.reject(token, function (el) { return el.ref === docRef })
  }, this)
}

lunr.Index.prototype.update = function (doc) {
  this.remove(doc)
  this.add(doc)
}

lunr.Index.prototype.idf = function (term) {
  var documentFrequency = this.tokenStore.get(term).length

  if (documentFrequency === 0) {
    return 1
  } else {
    return 1 + Math.log(this.tokenStore.length / documentFrequency)
  }
}

lunr.Index.prototype.search = function (query) {
  var queryTokens = this.pipeline.run(lunr.tokenizer(query)),
      queryArr = new Array (this.corpusTokens.length),
      documentSet = new lunr.SortedSet

  if (!queryTokens.some(lunr.Store.prototype.has, this.tokenStore)) return []

  queryTokens
    .filter(function (token) {
      return this.tokenStore.has(token)
    }, this)
    .forEach(function (token, i, tokens) {
      var fieldBoosts = this._fields.reduce(function (memo, f) { return memo + f.boost }),
          tf = 1 / tokens.length * this._fields.length,
          idf = this.idf(token),
          pos = this.corpusTokens.indexOf(token)

      if (pos > -1) queryArr[pos] = tf * idf

      this.tokenStore.get(token).forEach(function (d) { documentSet.add(d.ref) })
    }, this)

  var queryVector = new lunr.Vector (queryArr)

  var documentVectors = documentSet.map(function (documentRef) {
    var documentTokens = this.documentStore.get(documentRef),
        documentArr = new Array (this.corpusTokens.length)

    documentTokens.forEach(function (token) {
      var tf = this.tokenStore.get(token).filter(function (p) { return p.ref == documentRef })[0].tf,
          idf = this.idf(token)

      documentArr[this.corpusTokens.indexOf(token)] = tf * idf
    }, this)

    var vector = new lunr.Vector (documentArr)

    return { ref: documentRef, score: queryVector.similarity(vector) }
  }, this)

  return documentVectors.sort(function (a, b) {
    return b.score - a.score
  })
}
