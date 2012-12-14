var lunr = function (config) {
  var idx = new lunr.Index

  idx.pipeline.add(lunr.stopWordFilter, lunr.stemmer)

  if (config) config.call(idx, idx)

  return idx
}

