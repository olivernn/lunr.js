lunr.utils = {
  zeroFillArray: function (length) {
    while (this._zeros.length < length) {
      this._zeros = this._zeros.concat(this._zeros)
    }

    return this._zeros.slice(0, length)
  },

  _zeros: [0]
}
