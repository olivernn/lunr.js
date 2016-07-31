/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.seperator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @see lunr.tokenizer.seperator
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return lunr.utils.asString(t).toLowerCase() })

  var str = obj.toString().trim().toLowerCase(),
      len = str.length,
      tokens = []

  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
    var char = str.charAt(sliceEnd),
        sliceLength = sliceEnd - sliceStart

    if ((char.match(lunr.tokenizer.seperator) || sliceEnd == len)) {

      if (sliceLength > 0) {
        tokens.push(
          new lunr.Token (str.slice(sliceStart, sliceEnd), {
            position: [sliceStart, sliceLength],
            index: tokens.length
          })
        )
      }

      sliceStart = sliceEnd + 1
    }

  }

  return tokens
}

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.seperator = /[\s\-]+/
