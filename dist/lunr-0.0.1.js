// lunr.js version: 0.0.1
// (c) 2011 Oliver Nightingale
//
//  Released under MIT license.
//
/*!
 * Lunr
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
* Convinience method for instantiating and configuring a new Lunr index
*
* @param {Function} config A function that will be run with a newly created Lunr.Index as its context.
*/
var Lunr = function (name, config) {
  var index = new Lunr.Index (name)
  config.call(index, index)
  return index
}
/*!
 * Lunr - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A collection of utils that are used as part of the Lunr code base.
 */
Lunr.utils = {
  /**
   * ## Lunr.utils.uniq
   * Retuns an array with duplicate elements removed.
   *
   * @private
   * @params {Array} array - an array to remove duplicates from
   * @returns {Array} a copy of the input array with all duplicates removed.
   */
  uniq: function (array) {
    return array.reduce(function (out, elem) {
      if (out.indexOf(elem) === -1) out.push(elem)
      return out
    }, [])
  },

  /**
   * ## Lunr.utils.intersect
   * Finds the intersect of the array with all other passed arrays.
   *
   * @private
   */
  intersect: function (array) {
    var rest = [].slice.call(arguments, 1)
    return this.uniq(array).filter(function (item) {
      return rest.every(function (other) {
        return other.indexOf(item) >= 0
      })
    })
  }
}
Array.prototype.detect = function (fn, context) {
  var length = this.length
  var out = null

  for (var i=0; i < length; i++) {
   if (fn.call(context, this[i], i, this)) {
     out = this[i]
     break
   };
  };
  return out
}

Lunr.Trie = (function () {
  var Node = function (key) {
    this.children = []
    this.key = key
    this.value = []
  }

  Node.prototype = {
    childForKey: function (key) {
      var child = this.children.detect(function (child) { return child.match(key) })

      if (!child) {
        child = new Node (key)
        this.children.push(child)
      };

      return child
    },

    setValue: function (value) {
      this.value.push(value)
    },

    match: function (key) {
      return key === this.key
    }
  }

  var Trie = function () {
    this.root = new Node ("")
  }

  Trie.prototype = {
    get: function (key) {
      var keys = this.keys(key)
      var self = this

      return keys.reduce(function (res, key) {
        self.getNode(key).value.forEach(function (val) {
          res.push(val)
        })
        return res
      }, [])
    },

    getNode: function (key) {
      var recursiveGet = function (node, key) {
        if (!key.length) return node
        return recursiveGet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveGet(this.root, key)
    },

    keys: function (term) {
      var keys = [],
          term = term || ""

      var getKeys = function (node, term) {
        if (node.value.length) keys.push(term)

        node.children.forEach(function (child) {
          getKeys(child, term + child.key)
        })
      }

      getKeys(this.getNode(term), term)
      return keys
    },

    set: function (key, value) {
      var recursiveSet = function (node, key) {
        if (!key.length) return node.setValue(value)
        recursiveSet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveSet(this.root, key)
    }
  }

  return Trie
})()
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
  add: function (obj) {
    var doc = new Lunr.Document(obj, this.refName, this.fields)
    var words = doc.words()

    words.forEach(function (word) {
      this.trie.set(word.id, word.docs[0])
    }, this)
  },

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
  },
}
/*!
 * Lunr - Document
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Lunr.Document wraps any document that is added to the index.  It extracts any words from the document
 * fields that need indexing and formats the document in a way ready for insertion into the Lunr.Index
 * docStore.
 *
 * @constructor
 * @param {Object} original - the document to be added to the search index.
 * @param {Object} fields - the fields object from the index, indicationg which fields from the document need indexing.
 *
 */
Lunr.Document = function (original, refName, fields) {
  this.original = original
  this.fields = fields
  this.ref = original[refName]
}

Lunr.Document.prototype = {
  /**
   * ## Lunr.Document.prototype.asJSON
   * Converts this instance of Lunr.Document into a plain object ready for insertion into the Index's docStore.
   * The returned object consists of three properties, an auto generated id, an array of Lunr.Word ids and the
   * original document.
   *
   * @returns {Object} the plain object representation of the Lunr.Document.
   */
  asJSON: function () {
    return {
      id: this.ref,
      words: this.words().map(function (word) { return word.id }),
      original: this.original
    }
  },

  /**
   * ## Lunr.Document.prototype.words
   * For each field in the original document that requires indexing this method will create an instance of
   * Lunr.Word and then tally the total score for that word in the document as a whole.  At this time any
   * multiplier specified in the fields object will be applied.
   *
   * The list of words will then be converted into a format ready for insertion into the index's wordStore.
   *
   * @see {Lunr.Word}
   * @returns {Array} an array of all word objects ready for insertion into the index's wordStore.
   */
  words: function () {
    var words = {}
    var self = this
    var allWords = {}

    Object.keys(this.fields).forEach(function (fieldName) {
      words[fieldName] = self.original[fieldName].split(/\b/g)
        // filter out any non word words
        .filter(function (rawWord) {
          return !!rawWord.match(/\w/)
        })
        // convert each raw word into a search word
        .map(function (rawWord) {
          var word = new Lunr.Word(rawWord)
          if (!word.isStopWord()) return word.toString()
        })
        // filter out any stop words
        .filter(function (word) {
          return word
        })
        // create the total score
        .forEach(function (word) {
          if (!allWords[word]) { allWords[word] = {score: 0, ref: self.ref} }
          allWords[word].score = allWords[word].score + self.fields[fieldName].multiplier
        })
    })

    return Object.keys(allWords).map(function (word) {
      return {id: word, docs: [{score: allWords[word].score, documentId: self.ref}] }
    })

  }
}
/*!
 * Lunr - Word
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
* ## Lunr.Word
* A Lunr.Word wraps a string and provides methods to convert the string into a form ready for insertion
* into the word index.  It handles exclusion of stop word as well as performing any language based algorithms.
*
* @constructor
* @param {String} raw - the raw word to be used as the base of a search word.
*/
Lunr.Word = function (raw) {
  this.raw = raw
  this.out = this.raw.replace(/^\W+/, "").replace(/\W+$/, "").toLowerCase()
}

/**
 * ## Lunr.Word.stopWords
 * A list of words that will be considered stop words.
 */
Lunr.Word.stopWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "this"]

Lunr.Word.prototype = {

  /**
   * ## Lunr.Word.prototype.isStopWord
   * Determines whether or not this word is a stop word.
   *
   * @returns {Boolean}
   */
  isStopWord: function () {
    return (Lunr.Word.stopWords.indexOf(this.raw.toLowerCase()) !== -1)
  },

  /**
   * ## Lunr.Word.prototype.toString
   * Converts the search word into a string representation
   */
  toString: function () {
    if (this.isStopWord()) return
    this.stem()
    return this.out
    },

  /**
   * 18 May 2008
   * Stemming is the process for reducing inflected (or sometimes derived) words to their stem, base or root
   * form. Porter stemming is designed for the English language.
   * 
   * This code has been slighly adapted from Martin Porter's examples.
   *  - http://tartarus.org/~martin/PorterStemmer/
   *  
   * Please assume any errors found in the below code are translation errors
   * inserted by myself and not those of the original authors.
   *  
   * @author Matt Chadburn <matt@commuterjoy.co.uk>
   * 
   * June 2011
   * Additions and modifications by Oliver Nightingale
   *
   */
  stem: (function () {
    var step2list = {
      "ational" : "ate",
      "tional"  : "tion",
      "enci"    : "ence",
      "anci"    : "ance",
      "izer"    : "ize",
      "bli"     : "ble",
      "alli"    : "al",
      "entli"   : "ent",
      "eli"     : "e",
      "ousli"   : "ous",
      "ization" : "ize",
      "ation"   : "ate",
      "ator"    : "ate",
      "alism"   : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti"   : "al",
      "iviti"   : "ive",
      "biliti"  : "ble",
      "logi"    : "log"
    }

    var step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical"  : "ic",
      "ful"   : "",
      "ness"  : ""
    }

    var c = "[^aeiou]";          // consonant
    var v = "[aeiouy]";          // vowel
    var C = c + "[^aeiouy]*";    // consonant sequence
    var V = v + "[aeiou]*";      // vowel sequence

    var mgr0 = "^(" + C + ")?" + V + C;               // [C]VC... is m>0
    var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";  // [C]VC[V] is m=1
    var mgr1 = "^(" + C + ")?" + V + C + V + C;       // [C]VCVC... is m>1
    var s_v   = "^(" + C + ")?" + v;                   // vowel in stem

    return function () {
      var stem;
      var suffix;
      var firstch;
      var origword = this.out;
      var w = this.out;

      if (origword.length < 3) return origword

      var re;
      var re2;
      var re3;
      var re4;

      firstch = origword.substr(0,1);
      if (firstch == "y") {
        w = firstch.toUpperCase() + w.substr(1);
      }

      // Step 1a
      re = /^(.+?)(ss|i)es$/;
      re2 = /^(.+?)([^s])s$/;

      if (re.test(w)) { 
        w = w.replace(re,"$1$2");
      } else if (re2.test(w)) { 
        w = w.replace(re2,"$1$2");
      }

      // Step 1b
      re = /^(.+?)eed$/;
      re2 = /^(.+?)(ed|ing)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        re = new RegExp(mgr0);
        if (re.test(fp[1])) {
          re = /.$/;
          w = w.replace(re,"");
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1];
        re2 = new RegExp(s_v);
        if (re2.test(stem)) {
          w = stem;
          re2 = /(at|bl|iz)$/;
          re3 = new RegExp("([^aeiouylsz])\\1$");
          re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
          if (re2.test(w)) {  w = w + "e"; }
          else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
          else if (re4.test(w)) { w = w + "e"; }
        }
      }

      // Step 1c
      re = /^(.+?)y$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(s_v);
        if (re.test(stem)) { w = stem + "i"; }
      }

      // Step 2
      re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
          w = stem + step2list[suffix];
        }
      }

      // Step 3
      re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
          w = stem + step3list[suffix];
        }
      }

      // Step 4
      re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
      re2 = /^(.+?)(s|t)(ion)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        if (re.test(stem)) {
          w = stem;
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1] + fp[2];
        re2 = new RegExp(mgr1);
        if (re2.test(stem)) {
          w = stem;
        }
      }

      // Step 5
      re = /^(.+?)e$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        re2 = new RegExp(meq1);
        re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
          w = stem;
        }
      }

      re = /ll$/;
      re2 = new RegExp(mgr1);
      if (re.test(w) && re2.test(w)) {
        re = /.$/;
        w = w.replace(re,"");
      }

      if (firstch == "y") {
        w = firstch.toLowerCase() + w.substr(1);
      }

      this.out = w;
    }

  })()
}