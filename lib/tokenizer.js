/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return new lunr.Token (t) })

  // Remove any leading and trailing white space from the str.
  var str = obj.toString().replace(/^\s+|\s+$/g, '')

//  TODO: work out if this was really worth it.
//  for (var i = str.length - 1; i >= 0; i--) {
//    if (/\S/.test(str.charAt(i))) {
//      str = str.substring(0, i + 1)
//      break
//    }
//  }

  return str
    .split(/\s+/)
    .map(function (t) {
      return new lunr.Token (t)
    })
}
