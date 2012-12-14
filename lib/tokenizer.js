lunr.tokenizer = function (str) {
  if (Array.isArray(str)) return str

  var trailingPunctuationRegex = /[\!|\,|\.|\?]+$/,
      whiteSpaceSplitRegex = /\s+/

  return str.split(whiteSpaceSplitRegex).map(function (token) {
    return token.replace(trailingPunctuationRegex, '').toLowerCase()
  })
}
