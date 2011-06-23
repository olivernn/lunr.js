/*!
 * Search
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
* Convinience method for instantiating and configuring a new Search index
*
* @param {Function} config A function that will be run with a newly created Search.Index as its context.
*/
var Search = function (name, config) {
  var index = new Search.Index (name)
  config.call(index, index)
  return index
}