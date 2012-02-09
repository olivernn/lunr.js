Model.Lunr = function (config) {

  var index = Lunr('name', config)

  var addInstanceToIndex = function (instance) {
    setTimeout(function () {
      index.add(instance.attr())
    }, 0)
  }

  var plugin = function (klass) {

    var buildIndex = function () {
      klass.all().forEach(addInstanceToIndex)
    }

    var rebuildIndex = function () {
      index.empty()
      buildIndex()
    }

    klass.extend({
      search: function (term) {
        if (!term) return klass.chain([])
        return klass.chain(index.search(term).map(function (id) {
          return klass.find(id)
        }))
      },

      initSearchIndex: function () {
        buildIndex()
        klass.bind('add', addInstanceToIndex)
        klass.bind('changed', rebuildIndex) // note this event doesn't actually exist in js-model, but if it did...
        klass.bind('remove', rebuildIndex)
      },
    })
  }

  return plugin
};