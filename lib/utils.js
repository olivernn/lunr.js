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
    var out = []

    if (!array) return out

    for (var i=0; i < array.length; i++) {
      var elem = array[i]
      if (!~out.indexOf(elem)) out.push(elem)
    };

    return out
  },

  /**
   * ## Lunr.utils.intersect
   * Finds the intersect of the array with all other passed arrays.
   *
   * @private
   * @params {Array} array - an array to intersect with.
   * @params {Splat} any number of other arrays to intersect with array.
   * @returns {Array} a new array containing the intersection of all the input arrays
   */
  intersect: function (array) {
    var rest = Array.prototype.slice.call(arguments, 1),
        uniquedArr = this.uniq(array),
        len = uniquedArr.length,
        out = []

    for (var i=0; i < len; i++) {
      var elem = uniquedArr[i],
          inIntersect = true

      for (var j=0; j < rest.length; j++) {
        inIntersect = inIntersect && (~rest[j].indexOf(elem))
      };

      if (inIntersect) out.push(elem)
    };

    return out
  },

  /**
   * ## Lunr.utils.copy
   * Makes a copy of an object.
   *
   * @private
   * @params {Object} obj - the obj to copy.
   * @returns {Object} a copy of the input object.
   */
  copy: function (obj) {
    var out = {}
    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) return
      out[prop] = obj[prop]
    }
    return out
  },

  /**
   * ## Lunr.utils.forEachKey
   * Iterates through the passed object, yeilding each key to the passed function. Takes an
   * optional context object which will be used as the context in the passed function.
   *
   * @private
   * @params {Object} obj - the obj to iterate through.
   * @params {Function} fn - the function to yield to for each key.
   * @params {Obj} ctx - an optional context object for fn.
   */
  forEachKey: function (obj, fn, ctx) {
    for (var prop in obj) {
      fn.call(ctx, prop)
    }
  },

  /**
   * ## Lunr.utils.mapKeys
   * Iterates through the passed object, yeilding each key to the passed function and returning
   * an array of the output of that function. Takes an optional context object which will be used
   * as the context in the passed function.
   *
   * @private
   * @params {Object} obj - the obj to iterate through.
   * @params {Function} fn - the function to yield to for each key.
   * @params {Obj} ctx - an optional context object for fn.
   * @returns {Array} the result of mapping each key through fn.
   */
  mapKeys: function (obj, fn, ctx) {
    var out = []
    this.forEachKey(obj, function (key) {
      out.push(fn.call(ctx, key))
    })

    return out
  },

  /**
   * ## Lunr.utils.map
   * A compatibility wrapper to allow the use of map in browsers which do not support
   * it natively.  If a native map is available this is used, otherwise a fallback is
   * used.
   *
   * @private
   * @params {Array} arr - the array to map through.
   * @params {Function} fn - the function to yield to for each key.
   * @params {Obj} ctx - an optional context object for fn.
   * @returns {Array} the result of mapping the array through fn.
   */
  map: function (arr, fn, ctx) {
    var out = [],
        len = arr.length

    for (var i=0; i < len; i++) {
      out.push(fn.call(ctx, arr[i], i, arr))
    };

    return out
  },

  /**
   * ## Lunr.utils.reduce
   * A compatibility wrapper to allow the use of reduce in browsers which do not support
   * it natively.  If a native reduce is available this is used, otherwise a fallback is
   * used.
   *
   * @private
   * @params {Array} arr - the array to map through.
   * @params {Function} fn - the function to yield to for each key.
   * @params {Obj} memo - the starting value of the memo.
   * @returns the result of reducing the array through fn.
   */
  reduce: function (arr, fn, memo) {
    var len = arr.length

    for (var i=0; i < len; i++) {
      memo = fn(memo, arr[i])
    };

    return memo
  },

  /**
   * ## Lunr.utils.forEach
   * A compatibility wrapper to allow the use of forEach in browsers which do not support
   * it natively.  If a native forEach is available this is used, otherwise a fallback is
   * used.
   *
   * @private
   * @params {Array} arr - the array to map through.
   * @params {Function} fn - the function to yield to for each key.
   * @params {Object} ctx - an optional context object for fn.
   */
  forEach: function (arr, fn, ctx) {
    var len = arr.length
    for (var i=0; i < len; i++) {
      fn.call(ctx, arr[i], i, arr)
    };
  }
};
