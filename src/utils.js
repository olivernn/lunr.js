/*!
 * Searchlite - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A collection of utils that are used as part of the Searchlite code base.
 */
Searchlite.utils = {
  /**
   * ## Searchlite.utils.uniq
   * Retuns an array with duplicate elements removed.
   *
   * @private
   * @params {Array} array - an array to remove duplicates from
   * @returns {Array} a copy of the input array with all duplicates removed.
   */
  uniq: function (array) {
    return array.reduce(function (out, elem) {
      if (out.indexOf(elem) === -1) out.push(elem)
      return out
    }, [])
  },

  /**
   * ## Searchlite.utils.intersect
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
  }
}