(function () {
  bench("stemmer", function () {
    Object.keys(stemmingFixture).forEach(function (word) {
      lunr.stemmer(word)
    })
  })
})()
