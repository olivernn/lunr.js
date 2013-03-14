/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * Helper function to trim a string, speed optimized.
 * See: http://blog.stevenlevithan.com/archives/faster-trim-javascript
 * 
 * @param {String} str The string to trim
 * @returns {String}
 */
lunr.trim = function (str) {
  str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} str The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (str) {
  if (Array.isArray(str)) return str

  var whiteSpaceSplitRegex = /\s+/

  return lunr.trim(str).split(whiteSpaceSplitRegex).map(function (token) {
    return token.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase()
  })
}
