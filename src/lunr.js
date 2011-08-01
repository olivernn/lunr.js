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