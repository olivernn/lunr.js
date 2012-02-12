/*!
 * Lunr - js-model adaptor
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */
 
/**
* Model.Lunr is a plugin for js-model to make integrating your model with a lunr search index easy.
*
* This adds a search method for querying the index, and returns model instances instead of ids.  It also
* automatically manages the index after models have been updated, deleted or added.
*
* @param {Object} config the config object for defining the index, see Lunr.Index docs.
*
* Example:
*
*     var Post = Model('post', function () {
*       this.use(Model.Lunr(function () {
*         this.field('title', {multiplier: 10})
*         this.field('body')
*       }))
*     })
*
*     Post.search(query)
*
*/
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