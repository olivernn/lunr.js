Search.utils = {
  uniq: function (array) {
    return array.reduce(function (out, elem) {
      if (out.indexOf(elem) === -1) out.push(elem)
      return out
    }, [])
  },

  intersect: function (array) {
    var rest = [].slice.call(arguments, 1)
    return this.uniq(array).filter(function (item) {
      return rest.every(function (other) {
        return other.indexOf(item) >= 0
      })
    })
  }
}