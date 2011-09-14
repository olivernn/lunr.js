/*!
 * Lunr - Index
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Lunr.Index provides the public api for the Lunr library.  It also manages setting up both a wordStore
 * and a docStore to persist all the words and documents that make up this index.  An index must be initialised
 * with a name, this name is important as it will be used to create and access the Lunr.Stores.  If the name
 * is changed then any previously created indexes will be unavailable.
 *
 */
Lunr.Index = function (name) {
  this.name = name
  this.refName = "id"
  this.fields = {} // by default no fields will be indexed
  // this.wordStore = new Lunr.Store (name + "-words")
  // this.docStore = new Lunr.Store (name + "-docs")

  // this.addQueue = []
  // this.indexing = false

  // initialize both the stores and store the deferred against storageInitialized
  // so you can do idx.storageInitialized.then(function () { console.log('ready') })
  // this.storageInitialized = new Lunr.Deferred([
  //   this.wordStore.init(), this.docStore.init()
  // ])

  this.trie = new Lunr.Trie ()
}

Lunr.Index.prototype = {

  /**
   * ## Lunr.Index.prototype.addList
   * Adds a list of objects to the index.
   *
   * Using addList will allow you to take advantage of the events being fired so that you can get an
   * idea of the progress of the indexing.
   *
   * @params {Array} a list of objects to add to the index.
   * @returns {Lunr.Deferred} a deferred object which will be resolved once the whole list of objects has been indexed.
   */
   // addList: function (list) {
   //   var deferreds = list.map(function (obj) {
   //     return this.add(obj)
   //   }, this)
   // 
   //   return new Lunr.Deferred(deferreds)
   // },


  /**
   * ## Lunr.Index.prototype.add
   * This method is the primary way of adding objects to the search index.  It will convert the passed
   * JSON object and convert it into a Lunr.Document.  The words from the document will then be extracted
   * add added to the wordStore.  Finally the document itself will be added to the docStore.
   *
   * Objects should only be added to the index one at a time.  This is to ensure the wordStore is correctly
   * maintained.  When adding a list of items to the index it may be more convinient to use the `addList` method
   * which will ensure only one object is added at a time.
   *
   * @see Lunr.Index.prototype.addList
   *
   * @params {Object} obj - the object to add to the index.
   * @returns {Lunr.Deferred} a deferred object that will be resolved when the object has been added to the index.
   */
   // add: function (obj) {
   //   var deferred = new Lunr.Deferred ()
   // 
   //   this.addQueue.push({
   //     doc: obj,
   //     deferred: deferred
   //   })
   //   
   //   if (!this.indexing) this._adding()
   // 
   //   return deferred
   // },

   /**
    * ## Lunr.Index.prototype._adding
    * Low level method, manages the addQueue etc
    */
   // _adding: function () {
   //   this.indexing = true
   // 
   //   if (!this.addQueue.length) {
   //     this.indexing = false
   //     return
   //   };
   // 
   //   var self = this
   // 
   //   var item = this.addQueue.pop()
   //   this._add(item.doc).then(function () {
   //     item.deferred.resolve()
   //     self._adding()
   //   })
   // },

   /**
    * ## Lunr.Index.prototype._add
    * Low level method, manages actually adding a document to the index
    */

  add: function (obj) {
    var doc = new Lunr.Document(obj, this.refName, this.fields)
    var words = doc.words()

    words.forEach(function (word) {
      this.trie.set(word.id, word.docs[0])
    }, this)
  },

  // _add: function (obj) {
  //   var self = this
  //   var doc = new Lunr.Document(obj, this.fields)
  //   var returnDeferred = new Lunr.Deferred ()
  // 
  //   var words = doc.words()
  // 
  //   var findDeferred = new Lunr.Deferred(words.map(function (word) {
  //     return self.wordStore.find(word.id)
  //   }))
  // 
  //   findDeferred.then(function (existingWords) {
  // 
  //     // push all the documents from any existing stored words
  //     // onto the new word object from the new document before
  //     // the new word is saved into the word store
  //     existingWords.forEach(function (existingWord) {
  //       if (existingWord) {
  //         matchingWord = words.filter(function (word) {
  //           return word.id === existingWord.id
  //         })[0]
  //       
  //         existingWord.docs.forEach(function (doc) {
  //           matchingWord.docs.push(doc)
  //         })
  //       };
  //     })
  // 
  //     // save all the new words found in the document, these will
  //     // incorporate any existing words (from the word store) list
  //     // of documents and scores etc.
  //     var saveDeferred = new Lunr.Deferred(words.map(function (word) {
  //       return self.wordStore.save(word)
  //     }))
  // 
  //     saveDeferred.then(function () {
  //       self.docStore.save(doc.asJSON()).then(function () {
  //         returnDeferred.resolve()
  //       })
  //     })
  //   })
  // 
  //   return returnDeferred
  // },

  /**
   * ## Lunr.Index.prototype.empty
   * Empties the the index of all documents and words.
   *
   * @returns {Lunr.Deferred} returns a deferred that is resolved when the index has been empties
   */
  // empty: function () {
  //   var self = this
  // 
  //   return new Lunr.Deferred ([
  //     self.wordStore.destroyAll(),
  //     self.docStore.destroyAll()
  //   ])
  // },

  /**
   * ## Lunr.Index.prototype.field
   * A method that is part of the DSL for setting up an index.  Use this method to describe which fields
   * from a document should be part of the index.  An options object can be passed as the second argument
   * that will change the way that a particular field is indexed.
   *
   * Currently the supported options are:
   * * __multiplier__ - a multiplier to apply to a field, you can use this to make sure certain fields are
   * considered more important, e.g. a documents title.
   *
   * @params {String} name - the name of the field to index in a document
   * @params {Object} opts - options for indexing this particular field
   *
   * ### Example
   *     this.field('title', { multiplier: 10 })
   *     this.field('body')
   *
   */
  field: function (name, opts) {
    this.fields[name] = opts || {multiplier: 1}
  },

  ref: function (name) {
    this.refName = name
  },

  /**
   * ## Lunr.Index.prototype.search
   * This method is the main interface for searching documents in the index.  You can pass in a string of words
   * separated by spaces.  By default the search is an AND search, so if you searched for 'foo bar' the results
   * would be those documents in the index that contain both the word foo AND the word bar.
   *
   * All searches are done asynchronously and the search method returns an instance of Lunr.Deferred.  The
   * deferred object will be resolved with the results of the search as soon as those results are available.
   *
   * @params {String} term - the term or terms to search the index for.
   * @returns {Lunr.Deferred} a deferred object that will be resolved once the search has completed.
   */

  search: function (term) {
    var words = term
      .split(' ')
      .map(function (str) {
        var word = new Lunr.Word(str)
        if (!word.isStopWord()) return word.toString()
      })
      .filter(function (wordString) {
        return wordString 
      })

    var docIds = words
      .map(function (word) {
        return this.trie.get(word)
          .sort(function (a, b) {
            if (a.score < b.score) return 1
            if (a.score > b.score) return -1
            return 0
          })
          .map(function (doc) {
            return doc.documentId
          })
      }, this)

    return Lunr.utils.intersect.apply(Lunr.utils, docIds)
  }

  // search: function (term) {
  //   var self = this
  //   var returnDeferred = new Lunr.Deferred ()
  // 
  //   // convert the term into search words
  //   var words = term
  //     .split(' ')
  //     .map(function (str) {
  //       var word = new Lunr.Word(str)
  //       if (!word.isStopWord()) return word.toString()
  //     })
  //     .filter(function (wordString) {
  //       return wordString 
  //     })
  // 
  //   var wordDeferred = new Lunr.Deferred (words.map(function (word) { return self.wordStore.find(word) }))
  // 
  //   wordDeferred.then(function (words) {
  //     if (!words[0]) {
  //       returnDeferred.resolve([])
  //     } else {
  //       var wordDocs = words
  //         .map(function (word) { 
  //           return word.docs.sort(function (a, b) {
  //             return b.score - a.score
  //           })
  //         })
  // 
  //       var docIds = Lunr.utils.intersect.apply(Lunr.utils, wordDocs.map(function (docs) {
  //         return docs.map(function (doc) {
  //           return doc.documentId 
  //         })
  //       }))
  // 
  //       var docDeferred = new Lunr.Deferred (docIds.map(function (docId) { return self.docStore.find(docId) }))
  // 
  //       docDeferred.then(function (searchDocs) {
  //         returnDeferred.resolve(searchDocs.map(function (searchDoc) {
  //           return searchDoc.original
  //         }))
  //       })
  //     }
  //   })
  // 
  //   return returnDeferred
  // 
  // }
}