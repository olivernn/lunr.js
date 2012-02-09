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

  copy: function (obj) {
    var out = {}
    for (prop in obj) {
      if (!obj.hasOwnProperty(prop)) return
      out[prop] = obj[prop]
    }
    return out
  },

  forEachKey: function (obj, fn, ctx) {
    for (prop in obj) {
      fn.call(ctx, prop)
    }
  },

  mapKeys: function (obj, fn, ctx) {
    var out = []
    this.forEachKey(obj, function (key) {
      out.push(fn.call(ctx, key))
    })

    return out
  },

  map: function (arr, fn, ctx) {
    var out = [],
        len = arr.length

    for (var i=0; i < len; i++) {
      out.push(fn.call(ctx, arr[i], i, arr))
    };

    return out
  },

  reduce: function (arr, fn, memo) {
    var len = arr.length

    for (var i=0; i < len; i++) {
      memo = fn(memo, arr[i])
    };

    return memo
  },

  forEach: function (arr, fn, ctx) {
    var len = arr.length
    for (var i=0; i < len; i++) {
      fn.call(ctx, arr[i], i, arr)
    };
  }
};
