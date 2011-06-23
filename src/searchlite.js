/*!
 * Searchlite
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
* Convinience method for instantiating and configuring a new Searchlite index
*
* @param {Function} config A function that will be run with a newly created Searchlite.Index as its context.
*/
var Searchlite = function (name, config) {
  var index = new Searchlite.Index (name)
  config.call(index, index)
  return index
}