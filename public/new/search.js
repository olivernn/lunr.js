var Search = function (name, config) {
  var index = new Search.Index (name)
  config.call(index, index)
  return index
}