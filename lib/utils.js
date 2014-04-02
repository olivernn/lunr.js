/*!
 * lunr.utils
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
})(this)

lunr.utils.reverseString = (function () {
  var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uDC00-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])([\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g,
      regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g

  return function (str) {
    var result = '',
        index = str.length

    str = str
      .replace(regexSymbolWithCombiningMarks, function ($0, $1, $2) {
        return lunr.utils.reverseString($2) + $1
      })
      .replace(regexSurrogatePair, '$2$1')

    while (index--) {
      result += str.charAt(index)
    }

    return result
  }
})()
