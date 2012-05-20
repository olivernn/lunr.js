lunr.utils = (function () {
  var arrayWrap = function (obj) {
    if (Array.isArray(obj)) return obj
    if (obj === undefined || obj === null) return []
    return [obj]
  }

  var flatten = function (array) {
    return array.reduce(function (flat, el) {
      if (Array.isArray(el)) {
        flatten(el).forEach(function (e) {
          flat.push(e)
        })
      } else {
        flat.push(el)
      }

      return flat
    }, [])
  }

  return {
    arrayWrap: arrayWrap,
    flatten: flatten
  }
})()
