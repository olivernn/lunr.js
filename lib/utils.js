/*!
 * Lunr - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A collection of utils that are used as part of the Lunr code base.
 */
Lunr.utils = {
  /**
   * ## Lunr.utils.uniq
   * Retuns an array with duplicate elements removed.
   *
   * @private
   * @params {Array} array - an array to remove duplicates from
   * @returns {Array} a copy of the input array with all duplicates removed.
   */
  uniq: function (array) {
    if (!array) return []
    return array.reduce(function (out, elem) {
      if (out.indexOf(elem) === -1) out.push(elem)
      return out
    }, [])
  },

  /**
   * ## Lunr.utils.intersect
   * Finds the intersect of the array with all other passed arrays.
   *
   * @private
   */
  intersect: function (array) {
    var rest = [].slice.call(arguments, 1)
    return this.uniq(array).filter(function (item) {
      return rest.every(function (other) {
        return other.indexOf(item) >= 0
      })
    })
  },

  detect: function (array, fn, context) {
    var length = array.length
    var out = null

    for (var i=0; i < length; i++) {
     if (fn.call(context, array[i], i, array)) {
       out = array[i]
       break
     };
    };
    return out
  },

  copy: function (obj) {
    return Object.keys(obj).reduce(function (memo, prop) {
      memo[prop] = obj[prop]
      return memo
    }, {})
  }
};
