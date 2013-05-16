/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} str The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (str) {
  if (!str) return []
  if (Array.isArray(str)) return str

  var str = str.replace(/^\s+/, '')

  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1)
      break
    }
  }

  return str
    .split(/\s+/)
    .map(function (token) {
      return token.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase()
    })
}
