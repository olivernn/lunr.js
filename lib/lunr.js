/*!
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright.
 * Copyright (C) 2013 Oliver Nightingale
 * MIT Licensed
 */
;

/**
 * Convinience function for instantiating a new lunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * @param {Function} config A function that will be called with the new instance
 * of the lunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new lunr.Index.
 * @namespace
 * @returns {lunr.Index}
 */
var lunr = function (config) {
  var idx = new lunr.Index

  idx.pipeline.add(lunr.stopWordFilter, lunr.stemmer)

  if (config) config.call(idx, idx)

  return idx
}

lunr.version = "@VERSION"

