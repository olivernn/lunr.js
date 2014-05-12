/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return (new lunr.TokenList)

  if (Array.isArray(obj)){
    return new lunr.TokenList(obj.map(function (t) { 
      return new lunr.Token({raw: t.toLowerCase()}) 
    }))
  } 

  var str = obj.toString(),
      preStrLength = str.length

  // Trim leading whitespace
  str = str.replace(/^\s+/, '')

  var trimCount = preStrLength - str.length

  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1)
      break
    }
  }

  var startPos = trimCount,
      tokens = new lunr.TokenList

  str.split(/\s/).forEach(function (_token, index) {
      if(index){ startPos += 1 }
        
      // I think lowercase should be a fn in the pipeline, not in the tokenizer
      var trimmedToken = _token.replace(/^\s+/, '').toLowerCase()
      if(trimmedToken !== "") {
        tokens.push(new lunr.Token({raw: trimmedToken, startPos: startPos}))
      }

      startPos += _token.length
    })

  return tokens
}
