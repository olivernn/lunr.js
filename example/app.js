require([
  '../lunr.js',
  'text!example_data.json'
], function (lunr, data) {

  var questions = JSON.parse(data).questions.map(function (raw) {
    return {
      id: raw.question_id,
      title: raw.title,
      body: raw.body,
      tags: raw.tags.join(' ')
    }
  })

  console.time('load')
  window.idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')
    this.field('tags')

    questions.forEach(function (q) {
      this.add(q)
    }, this)
  })
  console.timeEnd('load')

  window.profile = function (term) {
    console.profile('search')
    window.idx.search(term)
    console.profileEnd('search')
  }

  window.search = function (term) {
    console.time('search')
    window.idx.search(term)
    console.timeEnd('search')
  }

  window.serialize = function () {
    console.time('dump')
    var json = JSON.stringify(window.idx)
    console.timeEnd('dump')

    var serialized = JSON.parse(json)
    console.profile("load")
    var newIdx = lunr.Index.load(serialized)
    console.profileEnd("load")

    return newIdx
  }

})
