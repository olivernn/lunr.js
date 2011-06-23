/*!
 * Searchlite - Index
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Searchlite.Index provides the public api for the Searchlite library.  It also manages setting up both a wordStore
 * and a docStore to persist all the words and documents that make up this index.  An index must be initialised
 * with a name, this name is important as it will be used to create and access the Searchlite.Stores.  If the name
 * is changed then any previously created indexes will be unavailable.
 *
 */
Searchlite.Index = function (name) {
  this.name = name
  this.fields = {} // by default no fields will be indexed
  this.wordStore = new Searchlite.Store (name + "-words")
  this.docStore = new Searchlite.Store (name + "-docs")

  // initialize both the stores and store the deferred against storageInitialized
  // so you can do idx.storageInitialized.then(function () { console.log('ready') })
  this.storageInitialized = new Searchlite.Deferred([
    this.wordStore.init(), this.docStore.init()
  ])
}

Searchlite.Index.prototype = {

  /**
   * ## Searchlite.Index.prototype.addList
   * Adds a list of objects to the index.  When adding a list of objects to the index each object must be
   * added in serial so that the word index can be built up properly.  The addList method provides a simple
   * way to add items from a list serially.
   *
   * Using addList will allow you to take advantage of the events being fired so that you can get an
   * idea of the progress of the indexing.
   *
   * @params {Array} a list of objects to add to the index.
   * @returns {Searchlite.Deferred} a deferred object which will be resolved once the whole list of objects has been indexed.
   */
  addList: function (objs) {
    var self = this
    var list = objs.slice(0, objs.length)
    var deferred = new Searchlite.Deferred ()
    var interval
    var prevListLength = list.length

    this.addRecursive(list)

    interval = setInterval(function () {
      if (list.length) {
        if (list.length < prevListLength) {
          prevListLength = list.length
        }
      } else {
        clearInterval(interval)
        deferred.resolve()
      };
    }, 10)

    return deferred
  },

  /**
   * ## Searchlite.Index.prototype.addRecursive
   * A method that recursively adds items to the index.  This is a low level method used by the `addList` method.
   * When adding a list of objects it is advised to use the `addList` method.
   *
   * @private
   * @params {Array} the list of objects to add
   */
  addRecursive: function (list) {
    var self = this

    self.add(list.pop()).then(function () {
      list.length ? self.addRecursive(list) : (list = null)
    })
  },

  /**
   * ## Searchlite.Index.prototype.add
   * This method is the primary way of adding objects to the search index.  It will convert the passed
   * JSON object and convert it into a Searchlite.Document.  The words from the document will then be extracted
   * add added to the wordStore.  Finally the document itself will be added to the docStore.
   *
   * Objects should only be added to the index one at a time.  This is to ensure the wordStore is correctly
   * maintained.  When adding a list of items to the index it may be more convinient to use the `addList` method
   * which will ensure only one object is added at a time.
   *
   * @see Searchlite.Index.prototype.addList
   *
   * @params {Object} obj - the object to add to the index.
   * @returns {Searchlite.Deferred} a deferred object that will be resolved when the object has been added to the index.
   */
  add: function (obj) {
    var self = this
    var doc = new Searchlite.Document(obj, this.fields)
    var returnDeferred = new Searchlite.Deferred ()

    var words = doc.words()

    var findDeferred = new Searchlite.Deferred(words.map(function (word) {
      return self.wordStore.find(word.id)
    }))

    findDeferred.then(function (existingWords) {

      existingWords.forEach(function (existingWord) {
        if (existingWord) {
          matchingWord = words.filter(function (word) {
            return word.id === existingWord.id
          })[0]
          
          existingWord.docs.forEach(function (doc) {
            matchingWord.docs.push(doc)
          })
        };
      })

      var saveDeferred = new Searchlite.Deferred(words.map(function (word) {
        return self.wordStore.save(word)
      }))

      saveDeferred.then(function () {
        self.docStore.save(doc.asJSON()).then(function () {
          returnDeferred.resolve()
        })
      })
    })

    return returnDeferred
  },

  /**
   * ## Searchlite.Index.prototype.empty
   * Empties the the index of all documents and words.
   *
   * @returns {Searchlite.Deferred} returns a deferred that is resolved when the index has been empties
   */
  empty: function () {
    var self = this

    return new Searchlite.Deferred ([
      self.wordStore.destroyAll(),
      self.docStore.destroyAll()
    ])
  },

  /**
   * ## Searchlite.Index.prototype.field
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

  /**
   * ## Searchlite.Index.prototype.search
   * This method is the main interface for searching documents in the index.  You can pass in a string of words
   * separated by spaces.  By default the search is an AND search, so if you searched for 'foo bar' the results
   * would be those documents in the index that contain both the word foo AND the word bar.
   *
   * All searches are done asynchronously and the search method returns an instance of Searchlite.Deferred.  The
   * deferred object will be resolved with the results of the search as soon as those results are available.
   *
   * @params {String} term - the term or terms to search the index for.
   * @returns {Searchlite.Deferred} a deferred object that will be resolved once the search has completed.
   */
  search: function (term) {
    var self = this
    var returnDeferred = new Searchlite.Deferred ()

    // convert the term into search words
    var words = term
      .split(' ')
      .map(function (str) {
        var word = new Searchlite.Word(str)
        if (!word.isStopWord()) return word.toString()
      })
      .filter(function (wordString) {
        return wordString 
      })

    var wordDeferred = new Searchlite.Deferred (words.map(function (word) { return self.wordStore.find(word) }))

    wordDeferred.then(function (words) {
      if (!words[0]) {
        returnDeferred.resolve([])
      } else {
        var wordDocs = words
          .map(function (word) { 
            return word.docs.sort(function (a, b) {
              return b.score - a.score
            })
          })

        var docIds = Searchlite.utils.intersect.apply(Searchlite.utils, wordDocs.map(function (docs) {
          return docs.map(function (doc) {
            return doc.documentId 
          })
        }))

        var docDeferred = new Searchlite.Deferred (docIds.map(function (docId) { return self.docStore.find(docId) }))

        docDeferred.then(function (searchDocs) {
          returnDeferred.resolve(searchDocs.map(function (searchDoc) {
            return searchDoc.original
          }))
        })
      }
    })

    return returnDeferred

  }
}