/*!
 * lunr.trimmer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {

  // TODO: find a better way to do this,
  // it would be great to not spread the
  // implementation of wildcards throughout
  // the code like this.
  var replacer = function (match) {
    if (match.indexOf('*') >= 0) {
      return '*'
    } else {
      return ''
    }
  }

  return token.transform(function (s) {
    return s
      .replace(/^\W+/, replacer)
      .replace(/\W+$/, replacer)
  })
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
