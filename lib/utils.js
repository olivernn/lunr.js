/*!
 * lunr.utils
 */

lunr.utils = lunr.utils || {}


/**
 * Print a warning message to the console if it exists.
 *
 * @module
 * @param {String} message The message to be printed.
 */
lunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
})(this)
