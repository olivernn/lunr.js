module('AMD')

asyncTest('require', function () {
  // a global lunr will have been set by the lunr.js script import
  var globalLunr = window['lunr']

  // require the built version
  require(['../lunr.js'], function(lunr) {
    ok(!!lunr, '!!lunr')
    ok(lunr !== globalLunr, 'Ensure AMD lunr is not the same as global lunr')
    start()
  })
})

