lunr.StringScanner = function (str) {
  this.str = str
  this.separator = /\s/
}

lunr.StringScanner.prototype.forEach = function (fn, ctx) {
  for (var i = 0, start = 0, n = 0, l = this.str.length; i < l; i++) {

    if (this.separator.test(this.str[i])) {
      if (n) {
        fn.call(ctx, this.str.substr(start, n), start, n)
        n = 0
      }

      start = i + 1
    } else {
      n++
    }
  }

  if (n) fn.call(ctx, this.str.substr(start, n), start, n)
}
