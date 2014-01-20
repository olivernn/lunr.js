/*!
 * lunr.ngramtokenizer
 * Copyright (C) @YEAR Will Ballard
 */

/**
 * A function making function for splitting a string into ngram
 * tokens suitable for short string autocomplete indexing and fuzzy
 * name matching.
 *
 * In order to effectively boost exact matches, a start character \u0002
 * and an end character \u0003 are wrapped around the string and used
 * in the ngrams. This causes a sequence of characters at the start of
 * both a search query and a sought term to more tightly match than a similar
 * series of characters elsewhere in sought terms.
 *
 * @module
 * @param {Number} len Make character ngrams of this length
 * @returns {Function}
 */
lunr.ngramtokenizer = function (len) {
  return function(obj) {
    if (!arguments.length || obj == null || obj == undefined) return []
    if (Array.isArray(obj)) return obj.map(function (t) { return t.toLowerCase() })

    var str = "\u0002" + obj.toString() + '\u0003';

    if (str.length <= len) {
      return [str.toLowerCase()];
    } else {
      var buffer = [];
      for (var i = 0; i <= str.length - len; i++) {
        buffer.push(str.slice(i, i + len).toLowerCase());
      }
      return buffer;
    }
  }
}

/**
 * A tokenizer that indexes on character bigrams.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Function}
 */
lunr.bigramtokenizer = lunr.ngramtokenizer(2)
lunr.Pipeline.registerFunction(lunr.bigramtokenizer, 'bigramtokenizer')

/**
 * A tokenizer that indexes on character trigrams.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Function}
 */
lunr.trigramtokenizer = lunr.ngramtokenizer(3)
lunr.Pipeline.registerFunction(lunr.trigramtokenizer, 'trigramtokenizer')
